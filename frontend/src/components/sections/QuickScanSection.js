import { useLang } from "../../contexts/LanguageContext";
import { Check, Loader2, Lock } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function QuickScanSection() {
  const { t, lang } = useLang();
  const [loading, setLoading] = useState(false);
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
    <section data-testid="quickscan-section" className="py-24 md:py-32 bg-fidaro-green-light/40">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-6">
          <div className="inline-block text-[11px] uppercase tracking-[0.22em] text-fidaro-green font-semibold px-3 py-1 rounded-full bg-white">
            {t.quickscan.label}
          </div>
          <h2 className="mt-6 font-display text-4xl md:text-5xl text-fidaro-ink leading-[1.05]">
            {t.quickscan.title}
          </h2>
          <p className="mt-5 text-lg text-fidaro-text-muted leading-relaxed max-w-lg">
            {t.quickscan.body}
          </p>

          <ul className="mt-7 grid sm:grid-cols-2 gap-2">
            {t.quickscan.features.map((f, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-sm rounded-xl bg-white border border-fidaro-green-light px-3 py-2.5"
                data-testid={`qs-feature-${i}`}
              >
                <div className="w-5 h-5 rounded-md bg-fidaro-green-light flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-fidaro-green" />
                </div>
                <span className="text-fidaro-ink">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-6">
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-fidaro-green-light shadow-[0_20px_45px_-20px_rgba(15,20,16,0.18)]">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-7xl tabular text-fidaro-green-dark">€99</span>
                <span className="text-fidaro-text-muted text-sm">
                  {lang === "nl" ? "eenmalig" : "one-time"}
                </span>
              </div>
              <div className="text-[11px] uppercase tracking-widest text-fidaro-green font-semibold">
                Quick-Scan
              </div>
            </div>
            <p className="mt-3 text-fidaro-text-muted text-sm max-w-md">
              {lang === "nl"
                ? "Eerste, scherpe panddoorlichting binnen 48 uur. Veilig betalen via Stripe."
                : "Sharp first review within 48 hours. Secure payment via Stripe."}
            </p>

            <div className="mt-7 space-y-3">
              {[
                ["qs-inline-name", "name", t.contact.fields.name],
                ["qs-inline-email", "email", t.contact.fields.email],
                ["qs-inline-address", "property_address", t.contact.fields.address],
              ].map(([tid, key, ph]) => (
                <input
                  key={key}
                  data-testid={tid}
                  type={key === "email" ? "email" : "text"}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={ph}
                  className="w-full bg-fidaro-green-light/30 border border-fidaro-green-light rounded-xl px-4 py-3 text-sm text-fidaro-ink placeholder:text-fidaro-text-muted/70 focus:outline-none focus:border-fidaro-green focus:bg-white transition-colors"
                />
              ))}
            </div>

            <button
              data-testid="qs-inline-pay-btn"
              onClick={handleCheckout}
              disabled={loading}
              className="mt-5 w-full bg-fidaro-green hover:bg-fidaro-green-dark disabled:opacity-60 text-white rounded-xl px-6 py-3.5 text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_6px_22px_rgba(79,111,87,0.25)]"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {t.quickscan.cta}
            </button>
            <p className="mt-3 text-xs text-fidaro-text-muted text-center inline-flex items-center justify-center gap-1.5 w-full">
              <Lock className="w-3 h-3" />
              {lang === "nl" ? "SSL-versleuteld via" : "SSL secured by"} Stripe
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
