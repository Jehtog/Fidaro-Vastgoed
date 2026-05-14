import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "../i18n";

const LanguageContext = createContext({ lang: "nl", setLang: () => {}, t: translations.nl });

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("fidaro_lang") : null;
    return saved || "nl";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("fidaro_lang", lang);
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const t = translations[lang] || translations.nl;
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
