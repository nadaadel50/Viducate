import { useEffect, useState } from "react";

import { useGetPreferences } from "./get_user_language_pref";
import { useSavePreferences } from "./use_save_preferences";

type LanguageOption = "en" | "ar" | "Same as Video";

type Preferences = {
  summary: LanguageOption;
  quiz: LanguageOption;
  flashcards: LanguageOption;
};

const INITIAL_PREFERENCES: Preferences = {
  summary: "Same as Video",
  quiz: "Same as Video",
  flashcards: "Same as Video",
};

export function useCustomizeExperience(
  videoId: number | null | undefined,
  onClose: () => void,
) {
  const { submitPreferences, isSubmitting, saveError } = useSavePreferences();

  const {
    data,
    isLoading,
    error: getSessionsError,

    refetch,
  } = useGetPreferences();

  const [serverError, setServerError] = useState<string | null>(null);

  const [prefs, setPrefs] = useState<Preferences>(INITIAL_PREFERENCES);

  useEffect(() => {
    if (!data) return;

    setPrefs({
      summary: data.summaryLang,
      quiz: data.quizLang,
      flashcards: data.flashcardsLang,
    });
  }, [data]);

  const handlePreferenceChange = (
    key: keyof Preferences,
    value: LanguageOption,
  ) => {
    setPrefs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setServerError(null);

      if (!videoId) {
        setServerError("Video ID is missing");
        return;
      }

      await submitPreferences({
        videoId,
        summaryLang: prefs.summary,
        quizLang: prefs.quiz,
        flashcardsLang: prefs.flashcards,
      });

      await refetch();

      onClose();
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const apiError = error as {
          response: {
            data: {
              detail?: string;
            };
          };
        };

        setServerError(
          apiError.response.data.detail ?? "Failed to save preferences",
        );
      } else if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError("An unexpected error occurred");
      }
    }
  };

  return {
    prefs,
    handlePreferenceChange,

    isLoading,
    isSubmitting,

    serverError,
    clearError: () => setServerError(null),
    getSessionsError,
    handleSave,
    saveError,
  };
}
