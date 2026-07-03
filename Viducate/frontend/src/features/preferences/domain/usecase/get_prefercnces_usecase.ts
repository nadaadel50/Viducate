import type { PreferencesRepository } from "../repository/preferences_repository";

export class GetPreferencesUseCase {
  private getPreferencesRepo: PreferencesRepository;
  constructor(getPreferencesRepo: PreferencesRepository) {
    this.getPreferencesRepo = getPreferencesRepo;
  }

  async execute(videoId: number) {
    return await this.getPreferencesRepo.getPreferences(videoId);
  }
}
