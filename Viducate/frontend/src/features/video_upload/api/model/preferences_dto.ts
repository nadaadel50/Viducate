export interface UserPreferencesRequestDto {
  video_id: number;
  summary_language: "en" | "ar" | null; 
  quiz_language: "en" | "ar" | null;
  flashcard_language: "en" | "ar" | null;
}

export interface UserPreferencesResponseDto {
  video_id: number;
  summary_language: string | null;
  quiz_language: string | null;
  flashcard_language: string | null;
}