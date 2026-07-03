import type { PreferencesRepository } from "../repository/preferences_repository";
import type { VideoPreferences } from "../entity/video_preferences";

export class SavePreferencesUseCase {
  private savePreferencesRepo: PreferencesRepository;
  constructor(savePreferencesRepo: PreferencesRepository) {
    this.savePreferencesRepo = savePreferencesRepo;
  }

  async execute(prefs: VideoPreferences) {
    return await this.savePreferencesRepo.savePreferences(prefs);
  }
}
