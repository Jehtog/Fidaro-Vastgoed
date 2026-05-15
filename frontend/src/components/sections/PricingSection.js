import { useLang } from "../../contexts/LanguageContext";
import { Check, Loader2, Sparkles } from "lucide-react";
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
      if (res.data.url) window.location.href = res.data.url;
      else { toast.error("No checkout URL"); setLoading(false); }
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Checkout failed");
      setLoading(false);
    }
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
                  ? "bg-fidaro-ink text-white shadow-[0_30px_70px_-20px_rgba(15,20,16,0.5)]"
                  : "bg-white border border-fidaro-green-light text-fidaro-ink"
              }`}
            >
              {card.popular && (
                <>
                  <div className="absolute -top-24 -right-24 w-72 h-72 bg-fidaro-green/30 rounded-full blur-3xl" />
                </>
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
                  <a
                    href="#contact"
                    data-testid="investment-plan-cta"
                    className="mt-9 w-full inline-flex items-center justify-center bg-fidaro-ink text-white hover:bg-black rounded-full px-6 py-4 text-sm font-semibold transition-colors"
                  >
                    {card.cta}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-fidaro-text-muted max-w-2xl">{t.pricing.note}</p>
      </div>

      {showQuickForm && (
        <div
          className="fixed inset-0 z-50 bg-fidaro-darker/85 backdrop-blur flex items-center justify-center p-4"
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
                className="flex-1 bg-fidaro-ink hover:bg-black disabled:opacity-60 text-white rounded-full px-4 py-3 font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {lang === "nl" ? "Betaal € 99" : "Pay € 99"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
