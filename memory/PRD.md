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

### 2026-05-20 — Light advisory redesign + PDF fix
- ✅ Removed every `bg-fidaro-ink` / `bg-fidaro-darker` dark panel from Landing + WWS Calculator
- ✅ Footer rebuilt: light sage-cream with sage accents (was dark ink with green blur)
- ✅ CookieBanner: light white with sage CTA (was dark)
- ✅ ProblemSection callout: light sage with green left border (was dark gradient)
- ✅ GapSection "Fidaro valideert" panel: sage green-dark (was ink)
- ✅ AdvantageSection highlight column: sage green-dark (was ink)
- ✅ SolutionSection hover: sage green-dark (was ink)
- ✅ PricingSection popular card + modal backdrop + Investment Plan CTA: sage green-dark / white (was ink)
- ✅ WWS Calculator step indicator active + results sidebar + next/finish button: sage (was ink)
- ✅ CalculatorTeaser redesigned as premium sage gradient banner with mini-preview card (separates it visually from Quick-Scan)
- ✅ Removed last "MVP" wording from RoadmapSection (renamed Quick-Scan tile)
- ✅ **PDF EXPORT FIX**: Root cause was duplicate object key `levers` in COPY dictionary (string overwritten by object) — `doc.text(L.levers, ...)` was receiving an object and crashing jsPDF. Renamed object to `leversMap`, derived `category` locally via `determineRentCategory(result.total)`, and added defensive `String()` cast helper `txt()` for all `doc.text` arguments. **Verified end-to-end via Playwright: 3.4 MB valid 3-page PDF with %PDF-1.3 magic bytes, no JS console errors.**

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
