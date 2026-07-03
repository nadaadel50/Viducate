import { useEffect, useRef } from "react";
import { useLanguage } from "../../../../core/hooks/useLanguage";
import { updateLanguageUsecase } from "../../../../core/di/profile_container";
import type { UserProfileData } from "../../domain/entity/update_user_data";

export function usePreferences(initial: Pick<UserProfileData, "language_preference">) {
 
  const { locale } = useLanguage();
  const prevLocale = useRef(locale);

  useEffect(() => {
    if (prevLocale.current === locale) return;
    prevLocale.current = locale;
    updateLanguageUsecase.execute(locale);
  }, [locale]);

  return { language_preference: initial.language_preference };
}
