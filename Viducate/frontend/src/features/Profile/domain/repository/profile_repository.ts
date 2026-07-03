import type { ApiResult } from "../../../../core/api/apiResult";
import type { UpdateRequest } from "../entity/update_req";
import type { UserProfileData } from "../entity/update_user_data";

export interface ProfileRepository {
  updateLanguage(language: string): Promise<ApiResult<void>>;
  updateProfile(req: UpdateRequest): Promise<ApiResult<UserProfileData>>;
  getUserProfile(): Promise<ApiResult<UserProfileData>>;
  deleteAccount(): Promise<ApiResult<string>>;
}
