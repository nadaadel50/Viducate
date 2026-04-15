export interface UserPreferencesRequestDto {
  is_unified: boolean;
  summary_lang: string | null;
  quiz_lang: string | null;
  flashcards_lang: string | null;
}

export interface UserPreferencesResponseDto {
  status: string;
  message: string;
}