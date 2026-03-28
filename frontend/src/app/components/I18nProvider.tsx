import { useState, useEffect, type ReactNode } from "react";
import { I18nContext, translations, type Language } from "../../i18n";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem("webcraft-lang") as Language;
    return (saved === "ar" || saved === "en") ? saved : "en";
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("webcraft-lang", newLang);
  };

  const isRTL = lang === "ar";

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations[lang], isRTL }}>
      {children}
    </I18nContext.Provider>
  );
}
