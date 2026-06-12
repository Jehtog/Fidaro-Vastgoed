"""Resend transactional email helper for Fidaro Vastgoed.

Two notification types:
- new_lead: triggered on every POST /api/leads (contact form, Investment Plan request)
- payment_paid: triggered from the Stripe webhook when a Quick-Scan €99 is paid

All emails currently go to ADMIN_EMAIL only (Resend testmode requires verified recipient).
Failures are swallowed and logged — they must never block the API response.
"""
from __future__ import annotations

import asyncio
import logging
import os
from typing import Any, Dict, Optional

import resend

logger = logging.getLogger(__name__)

resend.api_key = os.environ.get("RESEND_API_KEY", "")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "fidarovastgoed@gmail.com")


def _esc(value: Any) -> str:
    """Minimal HTML-escape so user input cannot break the layout."""
    if value is None:
        return "—"
    s = str(value)
    if not s.strip():
        return "—"
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def _row(label: str, value: Any) -> str:
    return (
        f'<tr>'
        f'<td style="padding:8px 12px;font-size:12px;color:#6F6F6F;'
        f'text-transform:uppercase;letter-spacing:0.08em;width:160px;'
        f'vertical-align:top;">{_esc(label)}</td>'
        f'<td style="padding:8px 12px;font-size:14px;color:#0F1410;'
        f'font-weight:500;">{_esc(value)}</td>'
        f'</tr>'
    )


def _wrap(title: str, eyebrow: str, body_html: str) -> str:
    return f"""\
<!doctype html>
<html><body style="margin:0;padding:24px;background:#F5F7F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;margin:0 auto;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #EAF1EB;">
    <tr>
      <td style="background:#3F5C49;padding:24px 28px;">
        <div style="font-size:11px;color:#7AA487;text-transform:uppercase;letter-spacing:0.18em;font-weight:600;">{_esc(eyebrow)}</div>
        <div style="font-size:24px;color:#FFFFFF;font-weight:700;margin-top:6px;letter-spacing:-0.3px;">Fidaro Vastgoed</div>
      </td>
    </tr>
    <tr>
      <td style="padding:28px;">
        <h1 style="margin:0 0 14px 0;font-size:22px;color:#0F1410;letter-spacing:-0.3px;">{_esc(title)}</h1>
        {body_html}
      </td>
    </tr>
    <tr>
      <td style="padding:16px 28px;background:#EAF1EB;font-size:12px;color:#6F6F6F;">
        Verstuurd via Resend · Fidaro Admin
      </td>
    </tr>
  </table>
</body></html>"""


async def _send(subject: str, html: str, to: Optional[str] = None) -> None:
    # Read the key lazily so .env values loaded after import are still picked up.
    api_key = os.environ.get("RESEND_API_KEY", "")
    if not api_key:
        logger.warning("Resend API key not configured; skipping email send.")
        return
    resend.api_key = api_key
    sender = os.environ.get("SENDER_EMAIL", SENDER_EMAIL)
    recipient = to or os.environ.get("ADMIN_EMAIL", ADMIN_EMAIL)
    params = {
        "from": sender,
        "to": [recipient],
        "subject": subject,
        "html": html,
    }
    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        email_id = result.get("id") if isinstance(result, dict) else None
        logger.info("Resend email sent to %s (id=%s)", recipient, email_id)
    except Exception as exc:  # noqa: BLE001
        logger.error("Resend email failed for %s: %s", recipient, exc)


async def notify_new_lead(lead: Dict[str, Any]) -> None:
    """Notify admin about any new lead. Includes Investment Plan + contact form."""
    service = lead.get("service") or "contact"
    is_plan = service == "investment_plan"

    eyebrow = "Investment Plan €750" if is_plan else "Nieuwe lead"
    title = "Nieuwe Investment Plan aanvraag" if is_plan else "Nieuwe lead via Fidaro"

    rows = [
        _row("Naam", lead.get("name")),
        _row("E-mail", lead.get("email")),
        _row("Telefoon", lead.get("phone")),
        _row("Adres", lead.get("property_address")),
        _row("Dienst", service),
    ]
    if lead.get("construction_year"):
        rows.append(_row("Bouwjaar", lead.get("construction_year")))
    if lead.get("woz_value"):
        rows.append(_row("WOZ / vraagprijs", lead.get("woz_value")))
    if lead.get("message"):
        rows.append(_row("Bericht", lead.get("message")))
    if is_plan:
        rows.append(_row("Akkoord € 750", "✓ Ja" if lead.get("agreed_to_price") else "—"))
    rows.append(_row("Bron", lead.get("source")))

    table = (
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" '
        'width="100%" style="border-collapse:collapse;border-top:1px solid #EAF1EB;">'
        + "".join(rows)
        + "</table>"
    )

    cta_label = (
        "Bekijk in admin" if not is_plan else "Plan intake binnen 24u"
    )
    cta = (
        f'<div style="margin-top:24px;">'
        f'<a href="https://fidaro-quick-scan.preview.emergentagent.com/admin" '
        f'style="display:inline-block;background:#4F6F57;color:#FFFFFF;'
        f'text-decoration:none;padding:12px 22px;border-radius:999px;'
        f'font-weight:600;font-size:14px;">{_esc(cta_label)} →</a>'
        f'</div>'
    )

    subject = (
        "Fidaro · Nieuwe Investment Plan aanvraag (€750)"
        if is_plan
        else "Fidaro · Nieuwe lead binnengekomen"
    )

    body = table + cta
    await _send(subject, _wrap(title, eyebrow, body))


async def notify_payment_paid(payment: Dict[str, Any]) -> None:
    """Notify admin when a Stripe Quick-Scan €99 payment is confirmed paid."""
    md = payment.get("metadata") or {}
    rows = [
        _row("Bedrag", f"€ {payment.get('amount')} {str(payment.get('currency', '')).upper()}"),
        _row("Package", payment.get("package_id")),
        _row("Status", payment.get("payment_status")),
        _row("Naam", md.get("lead_name")),
        _row("E-mail", md.get("lead_email")),
        _row("Telefoon", md.get("lead_phone")),
        _row("Adres", md.get("lead_property_address")),
        _row("Session", payment.get("session_id")),
    ]
    table = (
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" '
        'width="100%" style="border-collapse:collapse;border-top:1px solid #EAF1EB;">'
        + "".join(rows)
        + "</table>"
    )
    cta = (
        '<div style="margin-top:24px;">'
        '<a href="https://fidaro-quick-scan.preview.emergentagent.com/admin" '
        'style="display:inline-block;background:#4F6F57;color:#FFFFFF;'
        'text-decoration:none;padding:12px 22px;border-radius:999px;'
        'font-weight:600;font-size:14px;">Bekijk in admin →</a>'
        "</div>"
    )
    body = (
        '<p style="margin:0 0 16px 0;color:#0F1410;font-size:15px;line-height:1.5;">'
        "Een nieuwe Quick-Scan betaling is succesvol verwerkt via Stripe. "
        "Plan een eerste contactmoment binnen 48 uur."
        "</p>"
        + table
        + cta
    )
    await _send(
        "Fidaro · Quick-Scan €99 betaald",
        _wrap("Quick-Scan €99 betaald", "Stripe · Quick-Scan", body),
    )
