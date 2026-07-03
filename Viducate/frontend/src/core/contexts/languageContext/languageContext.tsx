import { createContext } from "react";
import type { Locale } from "../../l10n";

export type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isRTL: boolean;
  toggleLocale: () => void;
};

export type LanguageContextProps = {
  children: React.ReactNode;
};
export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);
