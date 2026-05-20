import { useEffect, useState } from "react";
import { useLang } from "../contexts/LanguageContext";

export default function CookieBanner() {
  const { t } = useLang();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const consent = localStorage.getItem("fidaro_cookie");
      if (!consent) setShow(true);
    }
  }, []);

  const handle = (val) => {
    localStorage.setItem("fidaro_cookie", val);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      data-testid="cookie-banner"
      className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md bg-white border border-fidaro-green-light text-fidaro-ink rounded-2xl shadow-[0_18px_45px_-20px_rgba(15,20,16,0.25)] p-5 z-50 animate-fade-up"
    >
      <p className="text-sm text-fidaro-text-muted leading-relaxed">{t.cookie.text}</p>
      <div className="mt-3 flex gap-2">
        <button
          data-testid="cookie-accept-btn"
          onClick={() => handle("accepted")}
          className="bg-fidaro-green hover:bg-fidaro-green-dark text-white text-sm rounded-xl px-4 py-2 font-medium transition-colors"
        >
          {t.cookie.accept}
        </button>
        <button
          data-testid="cookie-decline-btn"
          onClick={() => handle("declined")}
          className="text-fidaro-text-muted hover:text-fidaro-ink text-sm rounded-xl px-4 py-2 transition-colors"
        >
          {t.cookie.decline}
        </button>
      </div>
    </div>
  );
}
