import { createContext, useContext } from "react";
import { en } from "./en";
import { ar } from "./ar";
import type { Translations } from "./en";

export type Language = "en" | "ar";

export interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
  isRTL: boolean;
}

export const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  t: en,
  isRTL: false,
});

export const translations: Record<Language, Translations> = { en, ar };

export const useI18n = () => useContext(I18nContext);
