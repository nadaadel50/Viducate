import { useEffect, useState } from "react";
import { LanguageContext, type LanguageContextProps } from "./languageContext";
import { defaultLocale, type Locale } from "../../l10n";

type LanguageProviderProps = LanguageContextProps & {
  initialLocale?: Locale;
};

export function LanguageProvider({
  children,
  initialLocale,
}: LanguageProviderProps) {
  const [manualLocale, setManualLocale] = useState<Locale | undefined>(
    undefined,
  );

  const locale: Locale = manualLocale ?? initialLocale ?? defaultLocale;
  const isRTL = locale === "ar";

  const toggleLocale = () => {
    setManualLocale((prev) => ((prev ?? locale) === "en" ? "ar" : "en"));
  };

  const setLocale = (newLocale: Locale) => {
    setManualLocale(newLocale);
  };

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [locale, isRTL]);

  return (
    <LanguageContext.Provider
      value={{ locale, setLocale, isRTL, toggleLocale }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
