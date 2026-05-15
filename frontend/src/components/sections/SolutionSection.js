import { useLang } from "../../contexts/LanguageContext";
import { CheckCircle2, TrendingDown, Wrench, XCircle } from "lucide-react";

const icons = [CheckCircle2, TrendingDown, Wrench, XCircle];

export default function SolutionSection() {
  const { t } = useLang();
  return (
    <section id="solution" data-testid="solution-section" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-3xl">
          <div className="inline-block text-[11px] uppercase tracking-[0.22em] text-fidaro-green font-semibold px-3 py-1 rounded-full bg-fidaro-green-light">
            {t.solution.label}
          </div>
          <h2 className="mt-6 font-display text-4xl md:text-6xl text-fidaro-ink leading-[1.02]">
            {t.solution.title}
          </h2>
          <p className="mt-5 text-lg text-fidaro-text-muted leading-relaxed">{t.solution.body}</p>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.solution.outcomes.map((o, i) => {
            const Icon = icons[i];
            return (
              <div
                key={i}
                data-testid={`outcome-card-${i}`}
                className="group relative rounded-3xl border border-fidaro-green-light bg-white p-7 hover:bg-fidaro-ink hover:border-fidaro-ink hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 right-0 font-mono text-xs text-fidaro-text-muted/40 group-hover:text-white/30 px-4 py-3">
                  0{i + 1}
                </div>
                <div className="w-11 h-11 rounded-xl bg-fidaro-green-light flex items-center justify-center text-fidaro-green group-hover:bg-fidaro-green group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-fidaro-ink group-hover:text-white tracking-tight transition-colors">
                  {o.title}
                </h3>
                <p className="mt-2 text-sm text-fidaro-text-muted group-hover:text-white/65 leading-relaxed transition-colors">
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
