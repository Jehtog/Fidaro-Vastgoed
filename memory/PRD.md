# Fidaro Vastgoed — Product Requirements Document

## Original Problem Statement
Build a professional, premium bilingual (NL/EN) marketing website for Fidaro Vastgoed — a Dutch real estate investment validation service. The site validates property investments before purchase, focusing on WWS point system, rent caps, Box 3 taxation, energy labels and renovation potential. Goal: convert visitors into €99 Quick-Scan and €750 Investment Plan leads.

## Architecture
- **Backend:** FastAPI + MongoDB (Motor) on supervisor port 8001
- **Frontend:** React 19 + Tailwind + shadcn/ui + Cormorant Garamond / Outfit fonts
- **Payments:** Stripe Checkout via emergentintegrations (sk_test_emergent), webhook + DB-cached status
- **i18n:** Custom React Context with NL/EN toggle persisted in localStorage

## User Personas
**Primary — Emerging Private Investor (28–45)**: financially capable professional in finance/consulting/tech, has capital but lacks confidence in Dutch real estate regulation. Wants independent validation before buying.

## Core Requirements (Static)
- 12 sections: Hero, Problem, Gap, Solution (4 outcomes), Product (Investment Plan), Quick-Scan, Stats, Advantage, Pricing (€99 + €750), Process, FAQ, Contact
- Bilingual NL/EN switcher in header
- €99 Quick-Scan Stripe Checkout flow with success page
- Admin dashboard at `/admin` (password: `fidaro2026admin`)
- Cookie consent banner
- Footer with privacy/terms/disclaimer
- Premium green palette (#4F6F57 primary), no purple/violet gradients

## What's Been Implemented (2026-02-15)
- ✅ All 12 sections with Cormorant Garamond serif headlines + Outfit body
- ✅ Tweetalig (NL/EN) — alle teksten dynamisch
- ✅ Stripe €99 checkout: session creation + webhook + DB-cached status (resilient to library Pydantic issues)
- ✅ Admin: simple Bearer token auth, leads + payments tables
- ✅ Cookie consent banner (NL/EN)
- ✅ Mobile responsive header + nav
- ✅ FAQ accordion (shadcn)
- ✅ Contact form → MongoDB `leads` collection
- ✅ Quick-Scan inline form + modal both functional
- ✅ Dutch architecture imagery (Amsterdam canal houses) in hero & gap section
- ✅ All data-testid attributes for testing

## Backend Endpoints
- `GET /api/` — health
- `POST /api/leads` — contact form submission
- `POST /api/admin/login` — returns Bearer token
- `GET /api/admin/leads` — auth required
- `GET /api/admin/payments` — auth required
- `POST /api/payments/v1/checkout/session` — creates Stripe session for `quickscan` package (€99)
- `GET /api/payments/v1/checkout/status/{session_id}` — DB-cached status with best-effort Stripe sync
- `POST /api/webhook/stripe` — Stripe webhook to update payment_status

## Backlog (P0/P1/P2)
- **P0:** Production Stripe key (replace `sk_test_emergent` with real key when live)
- **P1:** Email notifications to fidarovastgoed@gmail.com on new lead/payment (Resend or SendGrid)
- **P1:** Privacy & Terms pages (currently `#privacy` and `#terms` placeholders)
- **P2:** Multi-language SEO (separate /en /nl URLs, hreflang)
- **P2:** Newsletter signup
- **P2:** Blog/insights section
- **P2:** Property auto-fetch from listing URL (Funda integration)
