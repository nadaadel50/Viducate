import type { ApiResult } from "../../../../core/api/apiResult";
import type { ProfileDataSource } from "../data_source/profile_data_source";
import type { ProfileRepository } from "../../domain/repository/profile_repository";
import type { UpdateRequest } from "../../domain/entity/update_req";
import type { UserProfileData } from "../../domain/entity/update_user_data";

export class ProfileRepoImp implements ProfileRepository {
  private dataSource: ProfileDataSource;

  constructor(dataSource: ProfileDataSource) {
    this.dataSource = dataSource;
  }
  updateProfile(req: UpdateRequest): Promise<ApiResult<UserProfileData>> {
    return this.dataSource.updateProfile(req);
  }

  updateLanguage(language: string): Promise<ApiResult<void>> {
    return this.dataSource.updateLanguage(language);
  }

  getUserProfile(): Promise<ApiResult<UserProfileData>> {
    return this.dataSource.getUserProfile();
  }
  deleteAccount(): Promise<ApiResult<string>> {
    return this.dataSource.deleteAccount();
  }
}
