import { useLang } from "../../contexts/LanguageContext";
import { Check } from "lucide-react";

const IMG =
  "https://images.unsplash.com/photo-1711097383282-28097ae16b1d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHwyfHxidXNpbmVzcyUyMGZpbmFuY2lhbCUyMGFuYWx5c2lzfGVufDB8fHx8MTc3ODgwMjExN3ww&ixlib=rb-4.1.0&q=85";

export default function ProductSection() {
  const { t } = useLang();
  return (
    <section
      id="product"
      data-testid="product-section"
      className="py-24 md:py-32 bg-fidaro-darker fidaro-grain relative text-white"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-12 gap-12 items-center relative">
        <div className="lg:col-span-6">
          <div className="text-xs uppercase tracking-[0.2em] text-fidaro-green font-semibold">
            {t.product.label}
          </div>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl text-white leading-tight">{t.product.title}</h2>
          <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-xl">{t.product.body}</p>

          <ul className="mt-10 space-y-4">
            {t.product.features.map((f, i) => (
              <li key={i} className="flex items-start gap-3" data-testid={`product-feature-${i}`}>
                <div className="mt-0.5 w-6 h-6 rounded-full bg-fidaro-green/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-fidaro-green" />
                </div>
                <span className="text-white/90">{f}</span>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            data-testid="product-cta"
            className="mt-10 inline-flex items-center gap-2 bg-fidaro-green hover:bg-fidaro-green-dark text-white rounded-xl px-7 py-4 font-medium transition-all"
          >
            {t.product.cta}
          </a>
        </div>

        <div className="lg:col-span-6">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <img src={IMG} alt="Property analysis documents" className="w-full h-[540px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-fidaro-darker/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 bg-fidaro-darker/80 backdrop-blur border border-white/10 rounded-2xl p-5">
              <div className="text-xs uppercase tracking-widest text-fidaro-green font-semibold">
                €750 — Investment Plan
              </div>
              <div className="mt-2 text-white text-sm">
                Inclusief WWS-audit, ROI scenario's, Box 3 impact & renovatiestrategie.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
