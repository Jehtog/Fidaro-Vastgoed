import { useLang } from "../../contexts/LanguageContext";
import { ArrowRight, ShieldCheck, TrendingUp, Activity, Zap } from "lucide-react";

export default function Hero() {
  const { t, lang } = useLang();
  return (
    <section
      data-testid="hero-section"
      className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-fidaro-darker text-white"
    >
      {/* Background spotlights */}
      <div className="absolute inset-0 spotlight-green" />
      <div className="absolute inset-0 fidaro-grain" />
      <div className="absolute -top-32 -left-32 w-[640px] h-[640px] rounded-full bg-fidaro-green/20 blur-[120px]" />
      <div className="absolute -bottom-32 right-0 w-[500px] h-[500px] rounded-full bg-fidaro-green-bright/10 blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-12 gap-14 items-center">
        {/* Copy */}
        <div className="lg:col-span-7 animate-fade-up">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-fidaro-green-bright font-semibold px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur">
            <span className="w-1.5 h-1.5 rounded-full bg-fidaro-green-bright pulse-soft" />
            WWS · ROI · BOX 3 · ENERGY
          </div>

          <h1 className="mt-7 font-display text-[44px] sm:text-6xl lg:text-[80px] leading-[0.96] text-white">
            Validate property{" "}
            <span className="bg-gradient-to-r from-fidaro-green-bright to-fidaro-green-light bg-clip-text text-transparent">
              investments
            </span>{" "}
            before you buy.
          </h1>

          <p className="mt-7 text-lg text-white/65 leading-relaxed max-w-xl">
            {t.hero.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#pricing"
              data-testid="hero-primary-cta"
              className="group inline-flex items-center gap-2 bg-fidaro-green hover:bg-fidaro-green-dark text-white rounded-full px-7 py-4 text-sm font-semibold tracking-tight transition-all shadow-[0_8px_30px_rgba(79,111,87,0.45)] hover:shadow-[0_12px_40px_rgba(79,111,87,0.55)] hover:-translate-y-0.5"
            >
              {lang === "nl" ? "Start €99 Quick-Scan" : "Start €99 Quick-Scan"}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#product"
              data-testid="hero-secondary-cta"
              className="inline-flex items-center gap-2 border border-white/15 hover:border-white/30 text-white hover:bg-white/5 rounded-full px-7 py-4 text-sm font-semibold tracking-tight transition-all"
            >
              {lang === "nl" ? "Bekijk Investment Plan" : "View Investment Plan"}
            </a>
          </div>

          <div className="mt-10 flex items-center gap-3 text-sm text-white/55">
            <ShieldCheck className="w-4 h-4 text-fidaro-green-bright" />
            <span>{t.hero.trust}</span>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="lg:col-span-5 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <DashboardPreview lang={lang} />
        </div>
      </div>
    </section>
  );
}

function DashboardPreview({ lang }) {
  const score = 184.5;
  const target = 187;
  const distance = (target - score).toFixed(1);
  const pct = (score / target) * 100;

  return (
    <div className="relative" data-testid="hero-dashboard">
      {/* glow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-fidaro-green/30 via-transparent to-fidaro-green-bright/20 blur-2xl rounded-[2.5rem]" />
      <div className="relative rounded-3xl glass p-1 shadow-2xl">
        <div className="rounded-[1.4rem] bg-fidaro-darker/80 backdrop-blur p-6 md:p-7">
          {/* top row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/55">
              <Activity className="w-3 h-3 text-fidaro-green-bright" />
              {lang === "nl" ? "Live indicatie" : "Live indication"}
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-fidaro-green-bright font-semibold">
              · WWS 2025
            </div>
          </div>

          {/* big score */}
          <div className="mt-5 flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/45">
                {lang === "nl" ? "Indicatieve WWS-score" : "Indicative WWS score"}
              </div>
              <div className="mt-1 font-display text-7xl text-white tabular leading-none">
                {score}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest text-white/45">
                {lang === "nl" ? "Tot 187" : "To 187"}
              </div>
              <div className="mt-1 font-mono text-2xl text-fidaro-green-bright">−{distance}</div>
            </div>
          </div>

          {/* progress */}
          <div className="mt-5">
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-fidaro-green to-fidaro-green-bright"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* metrics grid */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Metric
              label={lang === "nl" ? "Categorie" : "Category"}
              value={lang === "nl" ? "Middenhuur" : "Middle rent"}
              accent="amber"
            />
            <Metric
              label={lang === "nl" ? "Risico" : "Risk"}
              value={lang === "nl" ? "Gemiddeld" : "Medium"}
              accent="green"
            />
            <Metric
              label={lang === "nl" ? "Huurpotentieel" : "Rent potential"}
              value="€ 1.380 / mnd"
              icon={<TrendingUp className="w-3 h-3" />}
            />
            <Metric
              label="ROI"
              value="4,8 %"
              icon={<Zap className="w-3 h-3" />}
            />
          </div>

          {/* mini breakdown bars */}
          <div className="mt-6 space-y-2">
            {[
              { l: "Surface", v: 75, max: 90 },
              { l: "Energy (B)", v: 30, max: 62 },
              { l: "WOZ", v: 44.5, max: 60 },
              { l: "Kitchen", v: 8, max: 14 },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-3 text-[11px]">
                <span className="w-20 text-white/45 uppercase tracking-wider">{r.l}</span>
                <div className="flex-1 h-1 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-fidaro-green-bright/80"
                    style={{ width: `${(r.v / r.max) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-white/70 w-10 text-right tabular">{r.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, icon, accent }) {
  const accentCls =
    accent === "amber"
      ? "text-amber-300"
      : accent === "green"
      ? "text-fidaro-green-bright"
      : "text-white";
  return (
    <div className="rounded-xl bg-white/5 border border-white/8 p-3">
      <div className="text-[9px] uppercase tracking-widest text-white/40">{label}</div>
      <div className={`mt-1 text-sm font-semibold flex items-center gap-1.5 ${accentCls}`}>
        {icon}
        {value}
      </div>
    </div>
  );
}
