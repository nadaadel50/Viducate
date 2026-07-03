import { useState } from "react";
import type { VideoPreferences } from "../../domain/entity/video_preferences";

import { savePreferencesUseCase } from "../../../../core/di/pref_container";

export const useSavePreferences = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const submitPreferences = async (prefs: VideoPreferences) => {
    setIsSubmitting(true);
    try {
      const result = await savePreferencesUseCase.execute(prefs);
      return result;
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred when saving preferences",
      );
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitPreferences, isSubmitting, saveError };
};
