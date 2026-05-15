import { useLang } from "../../contexts/LanguageContext";
import { Check, FileText, BarChart3, Calculator, Zap, MapPin } from "lucide-react";

const ICONS = [FileText, BarChart3, Calculator, Zap, MapPin];

export default function ProductSection() {
  const { t, lang } = useLang();
  return (
    <section
      id="product"
      data-testid="product-section"
      className="py-24 md:py-32 bg-white relative"
    >
      <div className="relative max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-12 gap-14 items-start">
        <div className="lg:col-span-5">
          <div className="inline-block text-[11px] uppercase tracking-[0.22em] text-fidaro-green font-semibold px-3 py-1 rounded-full bg-fidaro-green-light">
            {t.product.label}
          </div>
          <h2 className="mt-6 font-display text-4xl md:text-5xl text-fidaro-ink leading-[1.05]">
            {t.product.title}
          </h2>
          <p className="mt-6 text-lg text-fidaro-text-muted leading-relaxed max-w-lg">{t.product.body}</p>

          <ul className="mt-8 space-y-2.5">
            {t.product.features.map((f, i) => {
              const Icon = ICONS[i] || Check;
              return (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-2xl bg-fidaro-green-light/40 border border-fidaro-green-light px-4 py-3"
                  data-testid={`product-feature-${i}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 border border-fidaro-green-light">
                    <Icon className="w-3.5 h-3.5 text-fidaro-green" />
                  </div>
                  <span className="text-fidaro-ink text-sm">{f}</span>
                </li>
              );
            })}
          </ul>

          {t.product.sourcingNote && (
            <p className="mt-5 text-sm text-fidaro-text-muted italic max-w-lg">
              {t.product.sourcingNote}
            </p>
          )}

          <a
            href="#contact"
            data-testid="product-cta"
            className="mt-8 inline-flex items-center gap-2 bg-fidaro-green hover:bg-fidaro-green-dark text-white rounded-xl px-7 py-3.5 text-sm font-semibold tracking-tight transition-all shadow-[0_6px_22px_rgba(79,111,87,0.25)]"
          >
            {t.product.cta}
          </a>
        </div>

        {/* Report mockup */}
        <div className="lg:col-span-7 lg:pl-6">
          <ReportMockup lang={lang} />
        </div>
      </div>
    </section>
  );
}

function ReportMockup({ lang }) {
  return (
    <div className="relative">
      <div className="relative rounded-3xl bg-white text-fidaro-ink overflow-hidden shadow-[0_30px_60px_-20px_rgba(15,20,16,0.18)] border border-fidaro-green-light">
        {/* Header */}
        <div className="bg-fidaro-green-dark text-white px-7 py-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-fidaro-green-light/90">
              Fidaro Investment Plan
            </div>
            <div className="font-bold text-lg mt-0.5">Damrak 1, Amsterdam</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-white/65">€ 750</div>
            <div className="text-xs text-white/55">Report 0042</div>
          </div>
        </div>

        {/* Body grid */}
        <div className="grid grid-cols-2 gap-4 p-6">
          <Cell title={lang === "nl" ? "WWS-score" : "WWS score"} big="184.5" sub={lang === "nl" ? "Indicatief · 2025" : "Indicative · 2025"} />
          <Cell title="ROI" big="4.8 %" sub={lang === "nl" ? "10-jaars hold" : "10y hold"} />
          <Cell title={lang === "nl" ? "Maandhuur" : "Monthly rent"} big="€ 1.380" sub={lang === "nl" ? "Potentieel" : "Potential"} />
          <Cell title="Box 3" big="€ 4.620" sub={lang === "nl" ? "Jaarlijks" : "Annual"} />
        </div>

        {/* Bars */}
        <div className="px-6 pb-6 space-y-2.5">
          {[
            { l: "WWS Audit", v: 95 },
            { l: "ROI scenarios", v: 88 },
            { l: "Tax impact", v: 72 },
            { l: "Energy & renovation", v: 80 },
          ].map((r) => (
            <div key={r.l} className="flex items-center gap-3 text-xs">
              <span className="w-32 text-fidaro-text-muted">{r.l}</span>
              <div className="flex-1 h-1.5 bg-fidaro-green-light rounded-full overflow-hidden">
                <div className="h-full bg-fidaro-green" style={{ width: `${r.v}%` }} />
              </div>
              <span className="font-mono text-fidaro-ink w-8 text-right tabular">{r.v}</span>
            </div>
          ))}
        </div>

        {/* Footer recommendation */}
        <div className="bg-fidaro-green-light/60 px-7 py-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-fidaro-green-dark/80">
              {lang === "nl" ? "Aanbeveling" : "Recommendation"}
            </div>
            <div className="text-fidaro-green-dark font-semibold mt-0.5">
              {lang === "nl" ? "Onderhandelen op prijs" : "Negotiate price"}
            </div>
          </div>
          <span className="text-[10px] uppercase tracking-widest font-mono text-fidaro-green-dark">
            v1.0
          </span>
        </div>
      </div>
    </div>
  );
}

function Cell({ title, big, sub }) {
  return (
    <div className="rounded-2xl border border-fidaro-green-light bg-fidaro-green-light/30 p-4">
      <div className="text-[10px] uppercase tracking-widest text-fidaro-text-muted">{title}</div>
      <div className="mt-1 text-2xl font-bold tabular text-fidaro-ink">{big}</div>
      <div className="text-[10px] text-fidaro-text-muted mt-0.5">{sub}</div>
    </div>
  );
}
