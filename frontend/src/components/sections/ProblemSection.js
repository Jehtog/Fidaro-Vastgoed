import { useLang } from "../../contexts/LanguageContext";
import { Scale, Receipt, Home, Zap, Lock } from "lucide-react";

const ICONS = [Scale, Receipt, Lock, Home, Zap];

export default function ProblemSection() {
  const { t } = useLang();
  return (
    <section id="problem" data-testid="problem-section" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-3xl">
          <div className="inline-block text-[11px] uppercase tracking-[0.22em] text-fidaro-green font-semibold px-3 py-1 rounded-full bg-fidaro-green-light">
            {t.problem.label}
          </div>
          <h2 className="mt-6 font-display text-4xl md:text-6xl text-fidaro-ink leading-[1.02]">
            {t.problem.title}
          </h2>
          <p className="mt-5 text-lg text-fidaro-text-muted">{t.problem.intro}</p>
        </div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {t.problem.items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div
                key={i}
                data-testid={`problem-item-${i}`}
                className="group relative rounded-3xl border border-fidaro-green-light bg-white p-7 hover:border-fidaro-green/40 hover:shadow-[0_8px_30px_rgba(15,20,16,0.06)] transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-fidaro-green-light flex items-center justify-center text-fidaro-green-dark group-hover:bg-fidaro-green group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="font-mono text-xs text-fidaro-text-muted">
                    0{i + 1}
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-bold text-fidaro-ink tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-fidaro-text-muted leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-14 max-w-4xl rounded-3xl bg-gradient-to-br from-fidaro-darker to-fidaro-dark text-white p-8 md:p-10 fidaro-grain relative">
          <p className="relative font-display text-2xl md:text-3xl leading-snug">
            "{t.problem.callout}"
          </p>
        </div>
      </div>
    </section>
  );
}
