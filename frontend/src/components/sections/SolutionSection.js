import { useLang } from "../../contexts/LanguageContext";
import { CheckCircle2, TrendingDown, Wrench, XCircle } from "lucide-react";

const icons = [CheckCircle2, TrendingDown, Wrench, XCircle];

export default function SolutionSection() {
  const { t } = useLang();
  return (
    <section id="solution" data-testid="solution-section" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.2em] text-fidaro-green font-semibold">
            {t.solution.label}
          </div>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl text-fidaro-text-dark leading-tight">
            {t.solution.title}
          </h2>
          <p className="mt-6 text-lg text-fidaro-text-muted leading-relaxed">{t.solution.body}</p>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.solution.outcomes.map((o, i) => {
            const Icon = icons[i];
            return (
              <div
                key={i}
                data-testid={`outcome-card-${i}`}
                className="group rounded-2xl border border-fidaro-green-light bg-white p-7 hover:bg-fidaro-green hover:-translate-y-1 transition-all duration-300"
              >
                <Icon className="w-8 h-8 text-fidaro-green group-hover:text-white transition-colors" />
                <h3 className="mt-5 font-serif text-2xl text-fidaro-text-dark group-hover:text-white">
                  {o.title}
                </h3>
                <p className="mt-3 text-sm text-fidaro-text-muted group-hover:text-white/85 leading-relaxed">
                  {o.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
