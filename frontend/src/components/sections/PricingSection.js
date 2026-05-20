import { useLang } from "../../contexts/LanguageContext";
import { Check, Loader2, Lock, FileText } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function PricingSection() {
  const { t, lang } = useLang();
  const [loading, setLoading] = useState(false);
  const [showQuickForm, setShowQuickForm] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", property_address: "" });
  const [planForm, setPlanForm] = useState({
    name: "",
    email: "",
    phone: "",
    property_address: "",
    construction_year: "",
    woz_value: "",
    message: "",
    agreed_to_price: false,
  });

  const handleCheckout = async () => {
    if (!form.name || !form.email) {
      toast.error(lang === "nl" ? "Naam en e-mail zijn verplicht" : "Name and email are required");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/payments/v1/checkout/session`, {
        package_id: "quickscan",
        origin_url: window.location.origin,
        ...form,
        language: lang,
      });
      if (res.data.url) window.location.href = res.data.url;
      else { toast.error("No checkout URL"); setLoading(false); }
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Checkout failed");
      setLoading(false);
    }
  };

  const handlePlanSubmit = async () => {
    if (!planForm.name || !planForm.email) {
      toast.error(lang === "nl" ? "Naam en e-mail zijn verplicht" : "Name and email are required");
      return;
    }
    if (!planForm.agreed_to_price) {
      toast.error(
        lang === "nl"
          ? "Vink het akkoord met het tarief van € 750 aan om te kunnen versturen"
          : "Please tick the agreement with the € 750 fee before submitting"
      );
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/leads`, {
        ...planForm,
        service: "investment_plan",
        source: "investment_plan_request",
        language: lang,
      });
      setSubmitted(true);
    } catch (e) {
      toast.error(e?.response?.data?.detail || (lang === "nl" ? "Verzenden mislukt" : "Submit failed"));
    } finally {
      setLoading(false);
    }
  };

  const closePlanForm = () => {
    setShowPlanForm(false);
    setSubmitted(false);
    setPlanForm({
      name: "",
      email: "",
      phone: "",
      property_address: "",
      construction_year: "",
      woz_value: "",
      message: "",
      agreed_to_price: false,
    });
  };

  return (
    <section id="pricing" data-testid="pricing-section" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-3xl">
          <div className="inline-block text-[11px] uppercase tracking-[0.22em] text-fidaro-green font-semibold px-3 py-1 rounded-full bg-fidaro-green-light">
            {t.pricing.label}
          </div>
          <h2 className="mt-6 font-display text-4xl md:text-6xl text-fidaro-ink leading-[1.02]">
            {t.pricing.title}
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-5 max-w-5xl">
          {t.pricing.cards.map((card) => (
            <div
              key={card.id}
              data-testid={`pricing-card-${card.id}`}
              className={`relative rounded-3xl p-8 md:p-10 transition-all overflow-hidden ${
                card.popular
                  ? "bg-fidaro-green-dark text-white shadow-[0_30px_70px_-20px_rgba(63,92,73,0.5)]"
                  : "bg-white border border-fidaro-green-light text-fidaro-ink"
              }`}
            >
              {card.popular && (
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-fidaro-green-bright/25 rounded-full blur-3xl" />
              )}
              <div className="relative">
                <div
                  className={`text-[10px] uppercase tracking-[0.22em] font-mono ${
                    card.popular ? "text-fidaro-green-bright" : "text-fidaro-text-muted"
                  }`}
                >
                  {card.name}
                </div>
                <div
                  className={`mt-4 font-display text-7xl tabular ${
                    card.popular ? "text-white" : "text-fidaro-ink"
                  }`}
                >
                  {card.price}
                </div>
                <p
                  className={`mt-3 text-sm ${
                    card.popular ? "text-white/65" : "text-fidaro-text-muted"
                  }`}
                >
                  {card.desc}
                </p>

                <ul className="mt-8 space-y-2.5">
                  {card.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 flex-shrink-0 ${
                          card.popular ? "bg-fidaro-green-bright/20" : "bg-fidaro-green-light"
                        }`}
                      >
                        <Check
                          className={`w-3 h-3 ${
                            card.popular ? "text-fidaro-green-bright" : "text-fidaro-green"
                          }`}
                        />
                      </div>
                      <span className={card.popular ? "text-white/90" : "text-fidaro-ink"}>{f}</span>
                    </li>
                  ))}
                </ul>

                {card.id === "quickscan" ? (
                  <button
                    data-testid="quickscan-buy-btn"
                    onClick={() => setShowQuickForm(true)}
                    className="mt-9 w-full bg-fidaro-green hover:bg-fidaro-green-dark text-white rounded-full px-6 py-4 text-sm font-semibold transition-all shadow-[0_8px_30px_rgba(79,111,87,0.45)]"
                  >
                    {card.cta}
                  </button>
                ) : (
                  <button
                    data-testid="investment-plan-cta"
                    onClick={() => setShowPlanForm(true)}
                    className="mt-9 w-full inline-flex items-center justify-center gap-2 bg-white text-fidaro-green-dark hover:bg-fidaro-green-light rounded-full px-6 py-4 text-sm font-semibold transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    {card.cta}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-fidaro-text-muted max-w-2xl">{t.pricing.note}</p>
      </div>

      {/* --- Quick-Scan modal (unchanged) ------------------------------------ */}
      {showQuickForm && (
        <div
          className="fixed inset-0 z-50 bg-fidaro-green-dark/45 backdrop-blur flex items-center justify-center p-4"
          data-testid="quickscan-modal"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl">
            <div className="text-[10px] uppercase tracking-widest text-fidaro-green font-mono">
              € 99 · Quick-Scan
            </div>
            <h3 className="mt-2 font-display text-3xl text-fidaro-ink">
              {lang === "nl" ? "Bestel je Quick-Scan" : "Order your Quick-Scan"}
            </h3>
            <p className="mt-2 text-sm text-fidaro-text-muted">
              {lang === "nl"
                ? "Je wordt veilig doorgeleid naar Stripe Checkout."
                : "You'll be securely redirected to Stripe Checkout."}
            </p>

            <div className="mt-6 space-y-3">
              {[
                ["qs-name-input", "name", t.contact.fields.name],
                ["qs-email-input", "email", t.contact.fields.email],
                ["qs-phone-input", "phone", t.contact.fields.phone],
                ["qs-address-input", "property_address", t.contact.fields.address],
              ].map(([tid, key, ph]) => (
                <input
                  key={key}
                  data-testid={tid}
                  type={key === "email" ? "email" : "text"}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={ph}
                  className="w-full bg-white border border-fidaro-green-light rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-fidaro-green focus:ring-2 focus:ring-fidaro-green/20"
                />
              ))}
            </div>

            <div className="mt-7 flex gap-3">
              <button
                data-testid="qs-cancel-btn"
                onClick={() => setShowQuickForm(false)}
                className="flex-1 border border-fidaro-green-light text-fidaro-text-muted rounded-full px-4 py-3 hover:bg-fidaro-green-light/40 transition-colors"
              >
                {lang === "nl" ? "Annuleren" : "Cancel"}
              </button>
              <button
                data-testid="qs-pay-btn"
                onClick={handleCheckout}
                disabled={loading}
                className="flex-1 bg-fidaro-green hover:bg-fidaro-green-dark disabled:opacity-60 text-white rounded-full px-4 py-3 font-semibold transition-colors flex items-center justify-center gap-2 shadow-[0_6px_22px_rgba(79,111,87,0.3)]"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {lang === "nl" ? "Betaal € 99" : "Pay € 99"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Investment Plan request modal ----------------------------------- */}
      {showPlanForm && (
        <div
          className="fixed inset-0 z-50 bg-fidaro-green-dark/45 backdrop-blur flex items-center justify-center p-4 overflow-y-auto"
          data-testid="investment-plan-modal"
        >
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 md:p-10 shadow-2xl my-8">
            {!submitted ? (
              <>
                <div className="text-[10px] uppercase tracking-widest text-fidaro-green font-mono">
                  € 750 · Fidaro Investment Plan
                </div>
                <h3 className="mt-2 font-display text-3xl text-fidaro-ink leading-tight">
                  {lang === "nl"
                    ? "Vraag het volledige Investment Plan aan"
                    : "Request the full Investment Plan"}
                </h3>
                <p className="mt-3 text-sm text-fidaro-text-muted leading-relaxed">
                  {lang === "nl"
                    ? "Vul je gegevens in. We nemen binnen 24 uur contact met je op voor een korte kennismaking. Pas daarna versturen we de factuur van € 750 (incl. btw)."
                    : "Fill in your details. We will contact you within 24 hours for a short intake call. Only after that we will send the invoice of € 750 (incl. VAT)."}
                </p>

                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  {[
                    ["plan-name", "name", lang === "nl" ? "Naam *" : "Name *", "text", true],
                    ["plan-email", "email", "E-mail *", "email", true],
                    ["plan-phone", "phone", lang === "nl" ? "Telefoon" : "Phone", "tel", false],
                    ["plan-address", "property_address", lang === "nl" ? "Adres van het pand" : "Property address", "text", false],
                    ["plan-year", "construction_year", lang === "nl" ? "Bouwjaar (optioneel)" : "Construction year (optional)", "number", false],
                    ["plan-woz", "woz_value", lang === "nl" ? "WOZ / vraagprijs (optioneel)" : "WOZ / asking price (optional)", "number", false],
                  ].map(([tid, key, ph, type, req]) => (
                    <input
                      key={key}
                      data-testid={tid}
                      type={type}
                      value={planForm[key]}
                      onChange={(e) => setPlanForm({ ...planForm, [key]: e.target.value })}
                      placeholder={ph}
                      className={`w-full bg-white border border-fidaro-green-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-fidaro-green focus:ring-2 focus:ring-fidaro-green/20 ${
                        ["property_address", "message"].includes(key) ? "sm:col-span-2" : ""
                      }`}
                      required={req}
                    />
                  ))}
                  <textarea
                    data-testid="plan-message"
                    value={planForm.message}
                    onChange={(e) => setPlanForm({ ...planForm, message: e.target.value })}
                    placeholder={
                      lang === "nl"
                        ? "Korte toelichting (optioneel) — bijv. type pand, je vraag, deadline"
                        : "Short message (optional) — e.g. property type, your question, deadline"
                    }
                    rows={3}
                    className="sm:col-span-2 w-full bg-white border border-fidaro-green-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-fidaro-green focus:ring-2 focus:ring-fidaro-green/20 resize-none"
                  />
                </div>

                {/* Mandatory agreement */}
                <label
                  className={`mt-5 flex items-start gap-3 p-4 rounded-2xl cursor-pointer border transition-colors ${
                    planForm.agreed_to_price
                      ? "border-fidaro-green bg-fidaro-green-light/50"
                      : "border-fidaro-green-light bg-fidaro-green-light/20 hover:border-fidaro-green/40"
                  }`}
                >
                  <input
                    type="checkbox"
                    data-testid="plan-agree"
                    checked={planForm.agreed_to_price}
                    onChange={(e) =>
                      setPlanForm({ ...planForm, agreed_to_price: e.target.checked })
                    }
                    className="mt-0.5 w-5 h-5 accent-fidaro-green flex-shrink-0"
                  />
                  <span className="text-sm text-fidaro-ink leading-snug">
                    {lang === "nl" ? (
                      <>
                        Ik begrijp dat het{" "}
                        <span className="font-semibold">Fidaro Investment Plan € 750 (incl. btw)</span>{" "}
                        kost en ga akkoord met dit tarief. Ik word eerst gebeld voor een intake;
                        pas na akkoord wordt de factuur verstuurd.
                      </>
                    ) : (
                      <>
                        I understand that the{" "}
                        <span className="font-semibold">Fidaro Investment Plan costs € 750 (incl. VAT)</span>{" "}
                        and I agree to this fee. I will first be contacted for an intake call;
                        the invoice is only sent after that.
                      </>
                    )}
                  </span>
                </label>

                <div className="mt-7 flex gap-3">
                  <button
                    data-testid="plan-cancel-btn"
                    onClick={closePlanForm}
                    className="flex-1 border border-fidaro-green-light text-fidaro-text-muted rounded-full px-4 py-3 hover:bg-fidaro-green-light/40 transition-colors"
                  >
                    {lang === "nl" ? "Annuleren" : "Cancel"}
                  </button>
                  <button
                    data-testid="plan-submit-btn"
                    onClick={handlePlanSubmit}
                    disabled={loading || !planForm.agreed_to_price}
                    className="flex-[2] bg-fidaro-green hover:bg-fidaro-green-dark disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full px-4 py-3 font-semibold transition-colors flex items-center justify-center gap-2 shadow-[0_6px_22px_rgba(79,111,87,0.3)]"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {lang === "nl" ? "Aanvraag versturen" : "Send request"}
                  </button>
                </div>

                <p className="mt-4 text-xs text-fidaro-text-muted text-center inline-flex items-center justify-center gap-1.5 w-full">
                  <Lock className="w-3 h-3" />
                  {lang === "nl"
                    ? "Je gegevens worden alleen gebruikt om contact op te nemen."
                    : "Your data is only used to contact you."}
                </p>
              </>
            ) : (
              <div data-testid="plan-success" className="text-center py-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-fidaro-green-light flex items-center justify-center">
                  <Check className="w-8 h-8 text-fidaro-green-dark" />
                </div>
                <h3 className="mt-5 font-display text-2xl text-fidaro-ink">
                  {lang === "nl" ? "Aanvraag ontvangen" : "Request received"}
                </h3>
                <p className="mt-3 text-sm text-fidaro-text-muted leading-relaxed max-w-md mx-auto">
                  {lang === "nl"
                    ? "Bedankt voor je interesse in het Fidaro Investment Plan. We nemen binnen 24 uur per e-mail of telefoon contact met je op voor een korte intake."
                    : "Thank you for your interest in the Fidaro Investment Plan. We will contact you within 24 hours by email or phone for a short intake."}
                </p>
                <button
                  data-testid="plan-close-btn"
                  onClick={closePlanForm}
                  className="mt-7 inline-flex items-center justify-center bg-fidaro-green hover:bg-fidaro-green-dark text-white rounded-full px-7 py-3 text-sm font-semibold transition-colors"
                >
                  {lang === "nl" ? "Sluiten" : "Close"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
