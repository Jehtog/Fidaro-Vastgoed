import { useLang } from "../../contexts/LanguageContext";
import { AlertTriangle } from "lucide-react";

export default function ProblemSection() {
  const { t } = useLang();
  return (
    <section id="problem" data-testid="problem-section" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.2em] text-fidaro-green font-semibold">
            {t.problem.label}
          </div>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl text-fidaro-text-dark leading-tight">
            {t.problem.title}
          </h2>
          <p className="mt-6 text-lg text-fidaro-text-muted">{t.problem.intro}</p>
        </div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.problem.items.map((item, i) => (
            <div
              key={i}
              data-testid={`problem-item-${i}`}
              className="rounded-2xl border border-fidaro-green-light bg-white p-7 hover:border-fidaro-green/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-fidaro-green text-sm font-semibold tracking-wider">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="mt-3 font-serif text-2xl text-fidaro-text-dark">{item.title}</h3>
              <p className="mt-3 text-sm text-fidaro-text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-start gap-4 max-w-4xl bg-fidaro-green-light/60 rounded-2xl p-6 md:p-8 border border-fidaro-green/20">
          <AlertTriangle className="w-6 h-6 text-fidaro-green-dark flex-shrink-0 mt-1" />
          <p className="font-serif text-xl md:text-2xl text-fidaro-green-dark leading-snug italic">
            "{t.problem.callout}"
          </p>
        </div>
      </div>
    </section>
  );
}
