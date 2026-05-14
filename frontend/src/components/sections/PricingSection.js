import { useLang } from "../../contexts/LanguageContext";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function PricingSection() {
  const { t, lang } = useLang();
  const [loading, setLoading] = useState(false);
  const [showQuickForm, setShowQuickForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", property_address: "" });

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
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("No checkout URL");
        setLoading(false);
      }
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Checkout failed");
      setLoading(false);
    }
  };

  return (
    <section id="pricing" data-testid="pricing-section" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.2em] text-fidaro-green font-semibold">
            {t.pricing.label}
          </div>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl text-fidaro-text-dark leading-tight">
            {t.pricing.title}
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-6 max-w-5xl">
          {t.pricing.cards.map((card) => (
            <div
              key={card.id}
              data-testid={`pricing-card-${card.id}`}
              className={`relative rounded-3xl p-10 transition-all ${
                card.popular
                  ? "bg-white border-2 border-fidaro-green shadow-2xl shadow-fidaro-green/15"
                  : "bg-fidaro-darker text-white"
              }`}
            >
              {card.popular && (
                <div className="absolute -top-3 left-10 bg-fidaro-green text-white text-xs uppercase tracking-widest px-3 py-1 rounded-full">
                  MVP
                </div>
              )}
              <div
                className={`text-xs uppercase tracking-widest font-semibold ${
                  card.popular ? "text-fidaro-green" : "text-fidaro-silver"
                }`}
              >
                {card.name}
              </div>
              <div
                className={`mt-3 font-serif text-6xl ${
                  card.popular ? "text-fidaro-text-dark" : "text-white"
                }`}
              >
                {card.price}
              </div>
              <p
                className={`mt-3 text-sm ${card.popular ? "text-fidaro-text-muted" : "text-white/70"}`}
              >
                {card.desc}
              </p>

              <ul className="mt-8 space-y-3">
                {card.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check
                      className={`w-4 h-4 mt-0.5 ${card.popular ? "text-fidaro-green" : "text-fidaro-green"}`}
                    />
                    <span className={card.popular ? "text-fidaro-text-dark" : "text-white/90"}>{f}</span>
                  </li>
                ))}
              </ul>

              {card.id === "quickscan" ? (
                <button
                  data-testid="quickscan-buy-btn"
                  onClick={() => setShowQuickForm(true)}
                  className="mt-10 w-full bg-fidaro-green hover:bg-fidaro-green-dark text-white rounded-xl px-6 py-4 font-medium transition-colors"
                >
                  {card.cta}
                </button>
              ) : (
                <a
                  href="#contact"
                  data-testid="investment-plan-cta"
                  className="mt-10 w-full inline-flex items-center justify-center bg-white text-fidaro-text-dark hover:bg-fidaro-green-light rounded-xl px-6 py-4 font-medium transition-colors"
                >
                  {card.cta}
                </a>
              )}
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-fidaro-text-muted max-w-2xl">{t.pricing.note}</p>
      </div>

      {showQuickForm && (
        <div
          className="fixed inset-0 z-50 bg-fidaro-darker/70 backdrop-blur flex items-center justify-center p-4"
          data-testid="quickscan-modal"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl">
            <h3 className="font-serif text-3xl text-fidaro-text-dark">€99 Quick-Scan</h3>
            <p className="mt-2 text-sm text-fidaro-text-muted">
              {lang === "nl"
                ? "Vul je gegevens in. Je wordt veilig doorgeleid naar Stripe Checkout."
                : "Enter your details. You'll be securely redirected to Stripe Checkout."}
            </p>

            <div className="mt-6 space-y-4">
              <input
                data-testid="qs-name-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t.contact.fields.name}
                className="w-full bg-fidaro-green-light/40 border border-fidaro-green-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-fidaro-green focus:ring-2 focus:ring-fidaro-green/20"
              />
              <input
                data-testid="qs-email-input"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={t.contact.fields.email}
                className="w-full bg-fidaro-green-light/40 border border-fidaro-green-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-fidaro-green focus:ring-2 focus:ring-fidaro-green/20"
              />
              <input
                data-testid="qs-phone-input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder={t.contact.fields.phone}
                className="w-full bg-fidaro-green-light/40 border border-fidaro-green-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-fidaro-green focus:ring-2 focus:ring-fidaro-green/20"
              />
              <input
                data-testid="qs-address-input"
                value={form.property_address}
                onChange={(e) => setForm({ ...form, property_address: e.target.value })}
                placeholder={t.contact.fields.address}
                className="w-full bg-fidaro-green-light/40 border border-fidaro-green-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-fidaro-green focus:ring-2 focus:ring-fidaro-green/20"
              />
            </div>

            <div className="mt-7 flex gap-3">
              <button
                data-testid="qs-cancel-btn"
                onClick={() => setShowQuickForm(false)}
                className="flex-1 border border-fidaro-green-light text-fidaro-text-muted rounded-xl px-4 py-3 hover:bg-fidaro-green-light/40 transition-colors"
              >
                {lang === "nl" ? "Annuleren" : "Cancel"}
              </button>
              <button
                data-testid="qs-pay-btn"
                onClick={handleCheckout}
                disabled={loading}
                className="flex-1 bg-fidaro-green hover:bg-fidaro-green-dark disabled:opacity-60 text-white rounded-xl px-4 py-3 font-medium transition-colors flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {lang === "nl" ? "Betaal €99" : "Pay €99"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
