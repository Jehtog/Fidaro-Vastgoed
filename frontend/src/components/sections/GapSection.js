import { useLang } from "../../contexts/LanguageContext";

const IMG =
  "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGZpbmFuY2lhbCUyMGFuYWx5c2lzfGVufDB8fHx8MTc3ODgwMjExN3ww&ixlib=rb-4.1.0&q=85";

export default function GapSection() {
  const { t } = useLang();
  return (
    <section data-testid="gap-section" className="py-24 md:py-32 bg-fidaro-green-light/50">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5">
          <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-fidaro-green/10">
            <img src={IMG} alt="Independent advisory" className="w-full h-[460px] object-cover" />
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="text-xs uppercase tracking-[0.2em] text-fidaro-green-dark font-semibold">
            {t.gap.label}
          </div>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl text-fidaro-green-dark leading-tight">
            {t.gap.title}
          </h2>
          <p className="mt-6 text-lg text-fidaro-text-dark/80 leading-relaxed max-w-xl">{t.gap.body}</p>

          <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
            <div className="text-center">
              <div className="font-serif text-3xl text-fidaro-text-dark">🏷</div>
              <div className="mt-2 text-xs uppercase tracking-wider text-fidaro-text-muted">Sell</div>
            </div>
            <div className="text-center">
              <div className="font-serif text-3xl text-fidaro-text-dark">€</div>
              <div className="mt-2 text-xs uppercase tracking-wider text-fidaro-text-muted">Finance</div>
            </div>
            <div className="text-center">
              <div className="font-serif text-3xl text-fidaro-green">✓</div>
              <div className="mt-2 text-xs uppercase tracking-wider text-fidaro-green font-semibold">Validate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
