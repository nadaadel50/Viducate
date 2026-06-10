import type { ApiResult } from "../../../../core/api/apiResult";
import type { UpdateRequest } from "../entity/update_req";
import type { UserProfileData } from "../entity/update_response";

export interface ProfileRepository {
  updateLanguage(language: string): Promise<ApiResult<void>>;
  updateProfile(req: UpdateRequest): Promise<ApiResult<UserProfileData>>;
}