from fastapi import FastAPI, APIRouter, HTTPException, Request, Header, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone

from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout,
    CheckoutSessionResponse,
    CheckoutStatusResponse,
    CheckoutSessionRequest,
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# MongoDB
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="Fidaro Vastgoed API")
api_router = APIRouter(prefix="/api")

# ===== Fixed packages (server-side only) =====
PACKAGES: Dict[str, Dict] = {
    "quickscan": {"amount": 99.00, "currency": "eur", "name": "Fidaro Quick-Scan"},
}

STRIPE_API_KEY = os.environ.get("STRIPE_API_KEY", "sk_test_emergent")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "fidaro2026admin")


# ===== Models =====
class LeadCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    property_address: Optional[str] = ""
    role: Optional[str] = ""  # owner / buyer
    service: Optional[str] = ""  # quickscan / investment_plan / consult
    message: Optional[str] = ""
    language: Optional[str] = "nl"
    source: Optional[str] = "contact_form"


class Lead(LeadCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class CheckoutCreateRequest(BaseModel):
    package_id: str
    origin_url: str
    # Optional lead info captured before checkout
    name: Optional[str] = ""
    email: Optional[str] = ""
    phone: Optional[str] = ""
    property_address: Optional[str] = ""
    language: Optional[str] = "nl"


class AdminLoginRequest(BaseModel):
    password: str


def verify_admin(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.replace("Bearer ", "")
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid token")
    return True


# ===== Routes =====
@api_router.get("/")
async def root():
    return {"service": "Fidaro Vastgoed API", "status": "ok"}


@api_router.post("/leads", response_model=Lead)
async def create_lead(payload: LeadCreate):
    lead = Lead(**payload.model_dump())
    await db.leads.insert_one(lead.model_dump())
    return lead


@api_router.post("/admin/login")
async def admin_login(payload: AdminLoginRequest):
    if payload.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")
    return {"token": ADMIN_PASSWORD}


@api_router.get("/admin/leads")
async def admin_get_leads(_: bool = Depends(verify_admin)):
    leads = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return leads


@api_router.get("/admin/payments")
async def admin_get_payments(_: bool = Depends(verify_admin)):
    txs = await db.payment_transactions.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return txs


# ===== Stripe Payment Flow =====
@api_router.post("/payments/v1/checkout/session")
async def create_checkout_session(payload: CheckoutCreateRequest, request: Request):
    if payload.package_id not in PACKAGES:
        raise HTTPException(status_code=400, detail="Invalid package")

    pkg = PACKAGES[payload.package_id]
    amount = float(pkg["amount"])
    currency = pkg["currency"]

    # Build URLs from origin provided by frontend
    origin = payload.origin_url.rstrip("/")
    success_url = f"{origin}/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/#pricing"

    # Webhook url from request host
    host_url = str(request.base_url).rstrip("/")
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    metadata = {
        "package_id": payload.package_id,
        "package_name": pkg["name"],
        "lead_name": payload.name or "",
        "lead_email": payload.email or "",
        "lead_phone": payload.phone or "",
        "lead_property_address": payload.property_address or "",
        "language": payload.language or "nl",
    }

    checkout_request = CheckoutSessionRequest(
        amount=amount,
        currency=currency,
        success_url=success_url,
        cancel_url=cancel_url,
        metadata=metadata,
    )

    session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_request)

    # Persist transaction BEFORE redirect
    tx_doc = {
        "id": str(uuid.uuid4()),
        "session_id": session.session_id,
        "amount": amount,
        "currency": currency,
        "package_id": payload.package_id,
        "metadata": metadata,
        "payment_status": "initiated",
        "status": "open",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.payment_transactions.insert_one(tx_doc)

    # Also create a lead record (pre-payment)
    if payload.email:
        lead_doc = Lead(
            name=payload.name or "",
            email=payload.email,
            phone=payload.phone or "",
            property_address=payload.property_address or "",
            role="buyer",
            service="quickscan",
            message="Quick-Scan checkout initiated",
            language=payload.language or "nl",
            source="quickscan_checkout",
        ).model_dump()
        await db.leads.insert_one(lead_doc)

    return {"url": session.url, "session_id": session.session_id}


@api_router.get("/payments/v1/checkout/status/{session_id}")
async def get_checkout_status(session_id: str, request: Request):
    host_url = str(request.base_url).rstrip("/")
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)

    # Update DB once
    existing = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if existing and existing.get("payment_status") != "paid":
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {
                "$set": {
                    "payment_status": status.payment_status,
                    "status": status.status,
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                }
            },
        )

    return {
        "status": status.status,
        "payment_status": status.payment_status,
        "amount_total": status.amount_total,
        "currency": status.currency,
        "metadata": status.metadata,
    }


@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")

    host_url = str(request.base_url).rstrip("/")
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
    except Exception as e:
        logging.exception("Stripe webhook handling failed")
        raise HTTPException(status_code=400, detail=str(e))

    if webhook_response.session_id:
        await db.payment_transactions.update_one(
            {"session_id": webhook_response.session_id},
            {
                "$set": {
                    "payment_status": webhook_response.payment_status,
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                }
            },
        )

    return {"received": True}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
