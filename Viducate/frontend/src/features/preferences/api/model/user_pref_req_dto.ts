import type { VideoPreferences } from "../../domain/entity/video_preferences";

export interface UserPreferencesRequestDto {
  video_id: number;
  summary_language: "en" | "ar" | null;
  quiz_language: "en" | "ar" | null;
  flashcard_language: "en" | "ar" | null;
}

export function toUserPreferencesRequestDto(
  preferences: VideoPreferences,
): UserPreferencesRequestDto {
  return {
    video_id: preferences.videoId,
    summary_language:
      preferences.summaryLang === "Same as Video"
        ? null
        : preferences.summaryLang,

    quiz_language:
      preferences.quizLang === "Same as Video" ? null : preferences.quizLang,

    flashcard_language:
      preferences.flashcardsLang === "Same as Video"
        ? null
        : preferences.flashcardsLang,
  };
}
