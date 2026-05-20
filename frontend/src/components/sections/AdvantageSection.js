import { useLang } from "../../contexts/LanguageContext";
import { Check, X } from "lucide-react";

export default function AdvantageSection() {
  const { t } = useLang();
  return (
    <section data-testid="advantage-section" className="py-24 md:py-32 bg-fidaro-green-light/40">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-4xl">
          <div className="inline-block text-[11px] uppercase tracking-[0.22em] text-fidaro-green font-semibold px-3 py-1 rounded-full bg-white">
            {t.advantage.label}
          </div>
          <h2 className="mt-6 font-display text-5xl md:text-7xl text-fidaro-ink leading-[1.02]">
            {t.advantage.title}
          </h2>
          <p className="mt-6 text-lg text-fidaro-text-muted leading-relaxed max-w-2xl">
            {t.advantage.body}
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-4">
          {t.advantage.cols.map((c, i) => (
            <div
              key={i}
              data-testid={`advantage-col-${i}`}
              className={`rounded-3xl p-7 transition-all relative overflow-hidden ${
                c.highlight
                  ? "bg-fidaro-green-dark text-white shadow-[0_30px_60px_-20px_rgba(63,92,73,0.4)] scale-[1.02]"
                  : "bg-white border border-fidaro-green-light text-fidaro-ink"
              }`}
            >
              {c.highlight && (
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-fidaro-green/30 rounded-full blur-3xl" />
              )}
              <div className="relative">
                <div
                  className={`text-[10px] uppercase tracking-[0.22em] font-mono ${
                    c.highlight ? "text-fidaro-green-bright" : "text-fidaro-text-muted"
                  }`}
                >
                  0{i + 1} ·{" "}
                  {c.highlight
                    ? "Validation"
                    : i === 0
                    ? "Transaction"
                    : "Listing"}
                </div>
                <h3
                  className={`mt-4 text-2xl font-bold tracking-tight ${
                    c.highlight ? "text-white" : "text-fidaro-ink"
                  }`}
                >
                  {c.title}
                </h3>
                <ul className="mt-6 space-y-3">
                  {c.items.map((it, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      {c.highlight ? (
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-fidaro-green-bright" />
                      ) : (
                        <X className="w-4 h-4 mt-0.5 flex-shrink-0 text-fidaro-silver" />
                      )}
                      <span className={c.highlight ? "text-white/90" : "text-fidaro-text-muted"}>
                        {it}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
