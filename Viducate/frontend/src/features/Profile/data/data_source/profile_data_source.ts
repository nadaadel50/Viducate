import type { ApiResult } from "../../../../core/api/apiResult";
import type { UpdateRequest } from "../../domain/entity/update_req";
import type { UserProfileData } from "../../domain/entity/update_user_data";

export interface ProfileDataSource {
  updateLanguage(language: string): Promise<ApiResult<void>>;
  updateProfile(req: UpdateRequest): Promise<ApiResult<UserProfileData>>;
  getUserProfile(): Promise<ApiResult<UserProfileData>>;
  deleteAccount(): Promise<ApiResult<string>>;
}
