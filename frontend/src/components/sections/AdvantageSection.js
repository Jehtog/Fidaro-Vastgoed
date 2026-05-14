import { useLang } from "../../contexts/LanguageContext";
import { Check, X } from "lucide-react";

export default function AdvantageSection() {
  const { t } = useLang();
  return (
    <section data-testid="advantage-section" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.2em] text-fidaro-green font-semibold">
            {t.advantage.label}
          </div>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl text-fidaro-text-dark leading-tight">
            {t.advantage.title}
          </h2>
          <p className="mt-6 text-lg text-fidaro-text-muted leading-relaxed">{t.advantage.body}</p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {t.advantage.cols.map((c, i) => (
            <div
              key={i}
              data-testid={`advantage-col-${i}`}
              className={`rounded-2xl p-8 transition-all ${
                c.highlight
                  ? "bg-fidaro-green text-white shadow-xl shadow-fidaro-green/20 -translate-y-2 border-2 border-fidaro-green-dark"
                  : "bg-white border border-fidaro-green-light text-fidaro-text-dark"
              }`}
            >
              <h3
                className={`font-serif text-2xl ${c.highlight ? "text-white" : "text-fidaro-text-dark"}`}
              >
                {c.title}
              </h3>
              <ul className="mt-6 space-y-3">
                {c.items.map((it, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    {c.highlight ? (
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-white" />
                    ) : (
                      <X className="w-4 h-4 mt-0.5 flex-shrink-0 text-fidaro-silver" />
                    )}
                    <span className={c.highlight ? "text-white/95" : "text-fidaro-text-muted"}>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
