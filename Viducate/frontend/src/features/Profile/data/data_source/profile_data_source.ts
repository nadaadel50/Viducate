import type { ApiResult } from "../../../../core/api/apiResult";
import type { UpdateRequest } from "../../domain/entity/update_req";
import type { UserProfileData } from "../../domain/entity/update_response";

export interface ProfileDataSource {
  updateLanguage(language: string): Promise<ApiResult<void>>;
  updateProfile(req: UpdateRequest): Promise<ApiResult<UserProfileData>>;
}