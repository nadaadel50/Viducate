import type { VideoPreferences } from "../../domain/entity/video_preferences";

export interface UserPreferencesResponseDto {
  video_id: number;
  summary_language: string | null;
  quiz_language: string | null;
  flashcard_language: string | null;
}

export const fromUserPreferencesResponseDto = (
  dto: UserPreferencesResponseDto,
): VideoPreferences => ({
  videoId: dto.video_id,
  summaryLang: (dto.summary_language ?? "Same as Video") as
    | "en"
    | "ar"
    | "Same as Video",

  quizLang: (dto.quiz_language ?? "Same as Video") as
    | "en"
    | "ar"
    | "Same as Video",

  flashcardsLang: (dto.flashcard_language ?? "Same as Video") as
    | "en"
    | "ar"
    | "Same as Video",
});
