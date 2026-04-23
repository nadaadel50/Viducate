import { useState } from 'react';
import type { VideoPreferences } from '../../domain/entity/video_preferences';
import { SavePreferencesUseCase } from '../../domain/usecase/save_preferences_usecase';
import { PreferencesRepoImp } from '../../data/repository/preferences_repo_imp';

export const useSavePreferences = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitPreferences = async (prefs: VideoPreferences) => {
    setIsSubmitting(true);
    try {    
      const repo = new PreferencesRepoImp();
      const savePreferencesUseCase = new SavePreferencesUseCase(repo);
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