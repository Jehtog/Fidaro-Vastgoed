import { Link } from "react-router-dom";
import { useLang } from "../../contexts/LanguageContext";
import { Calculator, ArrowRight } from "lucide-react";

export default function CalculatorTeaser() {
  const { t } = useLang();
  return (
    <section data-testid="calculator-teaser" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="rounded-3xl bg-fidaro-green-light/50 border border-fidaro-green-light p-8 md:p-12 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-fidaro-green-dark font-semibold px-3 py-1 rounded-full bg-white">
              <Calculator className="w-3.5 h-3.5" />
              {t.calculatorTeaser.label}
            </div>
            <h2 className="mt-5 font-display text-3xl md:text-4xl text-fidaro-ink leading-tight tracking-tight">
              {t.calculatorTeaser.title}
            </h2>
            <p className="mt-4 text-fidaro-text-muted leading-relaxed max-w-xl">
              {t.calculatorTeaser.body}
            </p>
          </div>
          <div className="lg:col-span-5 flex lg:justify-end">
            <Link
              to="/wws-calculator"
              data-testid="calculator-teaser-cta"
              className="group inline-flex items-center gap-2 bg-fidaro-green hover:bg-fidaro-green-dark text-white rounded-xl px-7 py-3.5 text-sm font-semibold transition-all shadow-[0_6px_22px_rgba(79,111,87,0.25)]"
            >
              {t.calculatorTeaser.cta}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
