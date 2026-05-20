# Fidaro Vastgoed — Product Requirements Document

## Original Problem Statement
Build a professional, premium bilingual (NL/EN) marketing website for Fidaro Vastgoed — a Dutch real estate investment validation service. The site validates property investments before purchase, focusing on WWS point system, rent caps, Box 3 taxation, energy labels and renovation potential. Goal: convert visitors into €99 Quick-Scan and €750 Investment Plan leads.

## Architecture
- **Backend:** FastAPI + MongoDB (Motor) on supervisor port 8001
- **Frontend:** React 19 + Tailwind + shadcn/ui + Manrope font + light sage palette
- **Payments:** Stripe Checkout via emergentintegrations (sk_test_emergent), webhook + DB-cached status
- **PDF generation:** jsPDF + jspdf-autotable (client-side, NL/EN)
- **i18n:** Custom React Context with NL/EN toggle persisted in localStorage

## User Personas
**Primary — Emerging Private Investor (28–45)**: financially capable professional in finance/consulting/tech, has capital but lacks confidence in Dutch real estate regulation. Wants independent validation before buying.

## Core Requirements
- 12 sections landing (Hero, Problem, Gap, QuickScan, Product, Stats, Advantage, Pricing, Process, CalculatorTeaser, FAQ, Contact)
- WWS Calculator at /wws-calculator (4-step wizard, 2025 Dutch rules)
- Indicative WWS PDF report (NL/EN, logo + score + breakdown + levers + disclaimers)
- Bilingual NL/EN switcher
- €99 Quick-Scan Stripe Checkout flow + success page
- Admin dashboard at /admin (password: fidaro2026admin)
- Cookie consent banner (light)
- Footer light cream/sage (NO dark/black ink boxes)
- Premium sage palette (#4F6F57 primary, #3F5C49 dark, #EAF1EB light, #7AA487 bright)

## What's Been Implemented
### 2026-02-15
- All 12 landing sections, NL/EN, Stripe €99 flow, admin, cookie banner, FAQ, contact, hero image
- WWS calculator full logic (config + calculator + translations + UI 4-step wizard)
- PDF export module (jsPDF + autotable)

### 2026-05-20 — Light advisory redesign + PDF fix + Investment Plan request flow
- ✅ Removed every `bg-fidaro-ink` / `bg-fidaro-darker` dark panel from Landing + WWS Calculator + Admin login
- ✅ Footer + CookieBanner rebuilt light
- ✅ Problem callout, Gap "Fidaro valideert", Advantage highlight, Solution hover, Pricing popular card + modal, WWS step indicator + results sidebar + next button → all sage (was ink)
- ✅ CalculatorTeaser redesigned as premium sage gradient with mini-preview card
- ✅ Removed last "MVP" wording from RoadmapSection
- ✅ **PDF EXPORT FIX**: Duplicate object key `levers` in COPY dict — renamed to `leversMap`, category derived locally, defensive `String()` cast on all `doc.text` calls. Verified: valid 3-page PDF (3.4 MB) downloads cleanly, zero JS errors.
- ✅ **Investment Plan €750 request flow** (`InvestmentPlanModal` in `PricingSection.js`): dedicated NL/EN modal with name/email (verplicht), phone/address/year/woz/message (optional), and a **mandatory explicit consent checkbox** "Ik begrijp dat het Investment Plan € 750 (incl. btw) kost en ga akkoord met dit tarief". Submit button disabled until consent ticked. On success: thank-you state in the same modal. Lead saved via `POST /api/leads` with `service=investment_plan`, `source=investment_plan_request`, `agreed_to_price=true`.
- ✅ Backend `LeadCreate` model extended with `agreed_to_price`, `construction_year`, `woz_value`.
- ✅ Admin dashboard: new "Akkoord €" column showing ✓ for consented Investment Plan leads + green "Investment Plan €750" badge in Dienst column.

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
- **P0:** Production Stripe key (replace `sk_test_emergent` with live key on go-live)
- **P1:** Email notifications to fidarovastgoed@gmail.com on new lead/payment (Resend) — user deferred this iteration
- **P2:** SEO improvements (separate /en /nl URLs, hreflang)
- **P2:** Newsletter signup
- **P2:** Blog/insights section
- **P2:** Property auto-fetch from listing URL (Funda integration)
- **P2:** Annual WWS config update mechanism (2026 tables when available)
