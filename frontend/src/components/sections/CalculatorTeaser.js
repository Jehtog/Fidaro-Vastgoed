import { Link } from "react-router-dom";
import { useLang } from "../../contexts/LanguageContext";
import { Calculator, ArrowRight, Sparkles } from "lucide-react";

export default function CalculatorTeaser() {
  const { t, lang } = useLang();
  return (
    <section data-testid="calculator-teaser" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="relative rounded-[2rem] bg-gradient-to-br from-fidaro-green-dark via-fidaro-green-dark to-fidaro-green p-10 md:p-14 overflow-hidden shadow-[0_30px_70px_-25px_rgba(63,92,73,0.45)]">
          {/* decorative orbs */}
          <div className="absolute -top-24 -right-16 w-72 h-72 bg-fidaro-green-bright/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-16 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

          <div className="relative grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-fidaro-green-bright font-mono px-3 py-1.5 rounded-full bg-white/10 border border-white/15">
                <Sparkles className="w-3 h-3" />
                {lang === "nl" ? "Gratis instrument" : "Free tool"}
              </div>
              <h2 className="mt-6 font-display text-3xl md:text-5xl text-white leading-[1.05] tracking-tight">
                {t.calculatorTeaser.title}
              </h2>
              <p className="mt-5 text-white/75 leading-relaxed max-w-xl">
                {t.calculatorTeaser.body}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  to="/wws-calculator"
                  data-testid="calculator-teaser-cta"
                  className="group inline-flex items-center gap-2 bg-white hover:bg-fidaro-green-light text-fidaro-green-dark rounded-full px-7 py-3.5 text-sm font-semibold transition-all shadow-[0_10px_25px_-8px_rgba(0,0,0,0.25)]"
                >
                  <Calculator className="w-4 h-4" />
                  {t.calculatorTeaser.cta}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <span className="text-xs uppercase tracking-[0.22em] font-mono text-fidaro-green-bright">
                  {lang === "nl"
                    ? "187 punten · 2025 regels"
                    : "187 points · 2025 rules"}
                </span>
              </div>
            </div>

            {/* Mini score preview */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-6">
                <div className="text-[10px] uppercase tracking-[0.22em] font-mono text-fidaro-green-bright">
                  {lang === "nl" ? "Voorbeeld" : "Example"}
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-6xl tabular text-white leading-none">184</span>
                  <span className="text-sm text-white/65">
                    {lang === "nl" ? "/ 187 punten" : "/ 187 points"}
                  </span>
                </div>
                <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-fidaro-green-bright" style={{ width: "98.4%" }} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-white/5 px-3 py-2 border border-white/10">
                    <div className="text-[10px] uppercase tracking-widest text-white/55">
                      {lang === "nl" ? "Afstand 187" : "Distance to 187"}
                    </div>
                    <div className="mt-0.5 text-white font-semibold tabular">3 pt</div>
                  </div>
                  <div className="rounded-lg bg-white/5 px-3 py-2 border border-white/10">
                    <div className="text-[10px] uppercase tracking-widest text-white/55">
                      {lang === "nl" ? "Categorie" : "Category"}
                    </div>
                    <div className="mt-0.5 text-fidaro-green-bright font-semibold">
                      {lang === "nl" ? "Middenhuur" : "Mid-rent"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
