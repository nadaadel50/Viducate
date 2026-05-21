import type { ApiResult } from "../../../../core/api/apiResult";
import type { ProfileDataSource } from "../data_source/profile_data_source";
import type { ProfileRepository } from "../../domain/repository/profile_repository";

export class ProfileRepoImp implements ProfileRepository {
  private dataSource: ProfileDataSource;

  constructor(dataSource: ProfileDataSource) {
    this.dataSource = dataSource;
  }

  updateLanguage(language: string): Promise<ApiResult<void>> {
    return this.dataSource.updateLanguage(language);
  }
}