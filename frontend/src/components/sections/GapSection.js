import { useLang } from "../../contexts/LanguageContext";
import { Tag, Banknote, Layers, ShieldCheck, ArrowRight } from "lucide-react";

const COLS = [
  { Icon: Tag, key: "broker", label: { nl: "Makelaars verkopen", en: "Brokers sell" } },
  { Icon: Banknote, key: "bank", label: { nl: "Banken financieren", en: "Banks finance" } },
  { Icon: Layers, key: "platform", label: { nl: "Platforms tonen listings", en: "Platforms list" } },
];

export default function GapSection() {
  const { t, lang } = useLang();
  return (
    <section data-testid="gap-section" className="py-24 md:py-32 bg-fidaro-green-light/40">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-3xl">
          <div className="inline-block text-[11px] uppercase tracking-[0.22em] text-fidaro-green-dark font-semibold px-3 py-1 rounded-full bg-white">
            {t.gap.label}
          </div>
          <h2 className="mt-6 font-display text-4xl md:text-6xl text-fidaro-ink leading-[1.02]">
            {t.gap.title}
          </h2>
          <p className="mt-5 text-lg text-fidaro-text-muted leading-relaxed max-w-2xl">
            {t.gap.body}
          </p>
        </div>

        {/* Flow diagram */}
        <div className="mt-14 grid md:grid-cols-7 gap-3 items-stretch">
          {/* 3 transactional players */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-3">
            {COLS.map((c) => (
              <div
                key={c.key}
                className="rounded-2xl bg-white border border-fidaro-green-light p-5 flex flex-col"
              >
                <div className="w-9 h-9 rounded-lg bg-fidaro-green-light/60 flex items-center justify-center text-fidaro-text-muted">
                  <c.Icon className="w-4 h-4" />
                </div>
                <div className="mt-3 text-sm text-fidaro-ink font-semibold">{c.label[lang]}</div>
                <div className="mt-1 text-xs text-fidaro-text-muted/80">
                  {lang === "nl" ? "Transactiebelang" : "Transaction interest"}
                </div>
              </div>
            ))}
          </div>

          {/* Arrow */}
          <div className="md:col-span-1 flex items-center justify-center">
            <div className="hidden md:block w-full h-px bg-gradient-to-r from-fidaro-green-light via-fidaro-green to-fidaro-green-bright relative">
              <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-5 h-5 text-fidaro-green" />
            </div>
            <div className="md:hidden text-fidaro-green text-2xl">↓</div>
          </div>

          {/* Fidaro */}
          <div className="md:col-span-3 rounded-3xl bg-fidaro-ink text-white p-7 fidaro-grain relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-fidaro-green/30 blur-3xl rounded-full" />
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-fidaro-green flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div className="mt-5 text-2xl font-bold tracking-tight">
                {lang === "nl" ? "Fidaro valideert" : "Fidaro validates"}
              </div>
              <div className="mt-2 text-sm text-white/60">
                {lang === "nl"
                  ? "Onafhankelijk · WWS · ROI · Box 3 · Renovatie"
                  : "Independent · WWS · ROI · Box 3 · Renovation"}
              </div>
              <div className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-fidaro-green-bright font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-fidaro-green-bright pulse-soft" />
                {lang === "nl" ? "Validatiebelang" : "Validation interest"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
