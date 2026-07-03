import type { ApiResult } from "../../../../core/api/apiResult";
import type { UserProfileData } from "../entity/update_user_data";
import type { UpdateRequest } from "../entity/update_req";
import type { ProfileRepository } from "../repository/profile_repository";

export const UpdateProfile = (repo: ProfileRepository) => {
  return async (req: UpdateRequest): Promise<ApiResult<UserProfileData>> => {
    return repo.updateProfile(req);
  };
};
