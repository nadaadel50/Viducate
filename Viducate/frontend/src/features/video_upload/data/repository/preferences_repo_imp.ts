import type { PreferencesRepository } from '../../domain/repository/preferences_repository';
import type  { VideoPreferences } from '../../domain/entity/video_preferences';
import { preferencesDataSourceImp } from '../../api/data_source/preferences_dataSource_imp';
import type { UserPreferencesResponseDto } from '../../api/model/preferences_dto';
export class PreferencesRepoImp implements PreferencesRepository {
  
  async savePreferences(prefs: VideoPreferences): Promise<UserPreferencesResponseDto> {
    const dto = {
      is_unified: prefs.isUnified,
      summary_lang: prefs.isUnified ? null : prefs.summaryLang,
      quiz_lang: prefs.isUnified ? null : prefs.quizLang,
      flashcards_lang: prefs.isUnified ? null : prefs.flashcardsLang,
    };

    return await preferencesDataSourceImp.save(dto);
  }
}