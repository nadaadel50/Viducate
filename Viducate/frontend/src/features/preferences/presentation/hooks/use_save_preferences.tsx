import { useState } from 'react';
import type { VideoPreferences } from '../../domain/entity/video_preferences';

import { savePreferencesUseCase } from '../../../../core/di/pref_container';

export const useSavePreferences = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitPreferences = async (prefs: VideoPreferences) => {
    setIsSubmitting(true);
    try {    
     
      const result = await savePreferencesUseCase.execute(prefs);
      return result;
    } catch (error) {
      console.error("Error saving preferences", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitPreferences, isSubmitting };
};