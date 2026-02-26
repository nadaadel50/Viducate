import { useEffect, useState } from "react";
import { LanguageContext, type LanguageContextProps } from "./languageContext";
import { defaultLocale, type Locale } from "../../l10n";


export function LanguageProvider({ children }: LanguageContextProps) {
    const [locale, setLocale] = useState<Locale>(defaultLocale);
    const isRTL = locale === "ar";
    const toggleLocale = () => {
        setLocale(prevLocale => prevLocale === "en" ? "ar" : "en");
    }

    useEffect(()=>{
        document.documentElement.lang=locale;
        document.documentElement.dir=isRTL?"rtl":"ltr";
    },[locale,isRTL])
    return (
        <LanguageContext.Provider value={{ locale, setLocale, isRTL, toggleLocale }}>
            {children}
        </LanguageContext.Provider>
    )
}