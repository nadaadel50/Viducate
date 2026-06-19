
import { useState, useEffect, useRef } from 'react';
import type { AppearanceMode, UserPreferences } from '../_temp_mock';
import { useLanguage } from '../../../../core/hooks/useLanguage';
import { updateLanguageUsecase } from '../../../../core/di/profile_container';

export function usePreferences(initial: Pick<UserPreferences, 'appearance'>) {
  const [appearance, setAppearance] = useState<AppearanceMode>(initial.appearance);
  const { locale } = useLanguage();
  const prevLocale = useRef(locale);

  useEffect(() => {
    if (prevLocale.current === locale) return;
    prevLocale.current = locale;
    updateLanguageUsecase.execute(locale);
  }, [locale]);

  return { appearance, setAppearance };
}