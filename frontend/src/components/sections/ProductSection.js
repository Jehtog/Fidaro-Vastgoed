import { useLang } from "../../contexts/LanguageContext";
import { Check, FileText, BarChart3, Calculator, Zap, MapPin } from "lucide-react";

const ICONS = [FileText, BarChart3, Calculator, Zap, MapPin];

export default function ProductSection() {
  const { t, lang } = useLang();
  return (
    <section
      id="product"
      data-testid="product-section"
      className="py-24 md:py-32 bg-fidaro-darker fidaro-grain relative text-white overflow-hidden"
    >
      <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-fidaro-green/15 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-12 gap-14 items-start">
        <div className="lg:col-span-5">
          <div className="inline-block text-[11px] uppercase tracking-[0.22em] text-fidaro-green-bright font-semibold px-3 py-1 rounded-full bg-white/5 border border-white/10">
            {t.product.label}
          </div>
          <h2 className="mt-6 font-display text-4xl md:text-6xl text-white leading-[1.02]">
            {t.product.title}
          </h2>
          <p className="mt-6 text-lg text-white/65 leading-relaxed max-w-lg">{t.product.body}</p>

          <ul className="mt-10 space-y-3">
            {t.product.features.map((f, i) => {
              const Icon = ICONS[i] || Check;
              return (
                <li
                  key={i}
                  className="flex items-center gap-4 rounded-2xl bg-white/5 border border-white/8 p-4"
                  data-testid={`product-feature-${i}`}
                >
                  <div className="w-9 h-9 rounded-lg bg-fidaro-green/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-fidaro-green-bright" />
                  </div>
                  <span className="text-white/95">{f}</span>
                </li>
              );
            })}
          </ul>

          <a
            href="#contact"
            data-testid="product-cta"
            className="mt-10 inline-flex items-center gap-2 bg-fidaro-green hover:bg-fidaro-green-dark text-white rounded-full px-7 py-4 text-sm font-semibold tracking-tight transition-all"
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
      <div className="absolute -inset-2 bg-gradient-to-tr from-fidaro-green/30 to-fidaro-green-bright/20 blur-2xl rounded-[2rem]" />
      <div className="relative rounded-3xl bg-white text-fidaro-ink overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-fidaro-green-dark text-white px-7 py-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-fidaro-green-bright">
              Fidaro Investment Plan
            </div>
            <div className="font-bold text-lg mt-0.5">Damrak 1, Amsterdam</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-white/55">€ 750</div>
            <div className="text-xs font-mono text-white/55">REPORT-0042</div>
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
