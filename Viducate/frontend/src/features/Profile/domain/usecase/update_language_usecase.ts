import type { ApiResult } from "../../../../core/api/apiResult";
import type { ProfileRepository } from "../repository/profile_repository";

export class UpdateLanguageUsecase {
  private repo: ProfileRepository;

  constructor(repo: ProfileRepository) {
    this.repo = repo;
  }

  execute(language: string): Promise<ApiResult<void>> {
    return this.repo.updateLanguage(language);
  }
}