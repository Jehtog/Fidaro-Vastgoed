"""Backend API tests for Fidaro Vastgoed."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://fidaro-quick-scan.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_PASSWORD = "fidaro2026admin"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_token(session):
    r = session.post(f"{API}/admin/login", json={"password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, r.text
    return r.json()["token"]


# ===== Health =====
def test_root(session):
    r = session.get(f"{API}/", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert data.get("status") == "ok"
    assert "Fidaro" in data.get("service", "")


# ===== Leads =====
def test_create_lead_valid(session):
    payload = {
        "name": "TEST_User",
        "email": "test_user@example.com",
        "phone": "+31600000000",
        "service": "quickscan",
        "language": "nl",
        "message": "TEST_LEAD",
    }
    r = session.post(f"{API}/leads", json=payload, timeout=15)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["email"] == payload["email"]
    assert data["name"] == "TEST_User"
    assert "id" in data and "created_at" in data


def test_create_lead_invalid_email(session):
    r = session.post(f"{API}/leads", json={"name": "X", "email": "not-an-email"}, timeout=15)
    assert r.status_code == 422


# ===== Admin =====
def test_admin_login_wrong(session):
    r = session.post(f"{API}/admin/login", json={"password": "wrong"}, timeout=15)
    assert r.status_code == 401


def test_admin_login_correct(session):
    r = session.post(f"{API}/admin/login", json={"password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200
    assert r.json().get("token") == ADMIN_PASSWORD


def test_admin_leads_requires_auth(session):
    r = session.get(f"{API}/admin/leads", timeout=15)
    assert r.status_code == 401


def test_admin_leads_with_token(session, admin_token):
    r = session.get(f"{API}/admin/leads", headers={"Authorization": f"Bearer {admin_token}"}, timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    # The previously created lead should be present
    assert any(l.get("email") == "test_user@example.com" for l in data)


def test_admin_payments_requires_auth(session):
    r = session.get(f"{API}/admin/payments", timeout=15)
    assert r.status_code == 401


def test_admin_payments_with_token(session, admin_token):
    r = session.get(f"{API}/admin/payments", headers={"Authorization": f"Bearer {admin_token}"}, timeout=15)
    assert r.status_code == 200
    assert isinstance(r.json(), list)


# ===== Stripe Checkout =====
@pytest.fixture(scope="module")
def checkout_session(session):
    payload = {
        "package_id": "quickscan",
        "origin_url": BASE_URL,
        "name": "TEST_Buyer",
        "email": "test_buyer@example.com",
        "phone": "+31611111111",
        "property_address": "Teststraat 1, Amsterdam",
        "language": "nl",
    }
    r = session.post(f"{API}/payments/v1/checkout/session", json=payload, timeout=30)
    assert r.status_code == 200, r.text
    return r.json()


def test_checkout_session_creates_url(checkout_session):
    assert "url" in checkout_session and checkout_session["url"].startswith("http")
    assert "session_id" in checkout_session and checkout_session["session_id"]


def test_checkout_invalid_package(session):
    r = session.post(
        f"{API}/payments/v1/checkout/session",
        json={"package_id": "bogus", "origin_url": BASE_URL},
        timeout=15,
    )
    assert r.status_code == 400


def test_checkout_persists_payment_and_lead(session, admin_token, checkout_session):
    sid = checkout_session["session_id"]
    # Verify payment row exists with initiated status
    r = session.get(f"{API}/admin/payments", headers={"Authorization": f"Bearer {admin_token}"}, timeout=15)
    assert r.status_code == 200
    payments = r.json()
    match = [p for p in payments if p.get("session_id") == sid]
    assert match, f"payment_transactions row not found for session {sid}"
    assert match[0].get("payment_status") == "initiated"
    assert match[0].get("package_id") == "quickscan"
    assert float(match[0].get("amount")) == 99.0

    # Verify lead with quickscan_checkout source created
    r2 = session.get(f"{API}/admin/leads", headers={"Authorization": f"Bearer {admin_token}"}, timeout=15)
    leads = r2.json()
    assert any(
        l.get("email") == "test_buyer@example.com" and l.get("source") == "quickscan_checkout"
        for l in leads
    )


def test_checkout_status(session, checkout_session):
    sid = checkout_session["session_id"]
    r = session.get(f"{API}/payments/v1/checkout/status/{sid}", timeout=20)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "status" in data and "payment_status" in data
    assert data.get("currency") in (None, "eur")
