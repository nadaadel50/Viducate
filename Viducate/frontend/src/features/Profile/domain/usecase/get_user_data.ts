import type { ApiResult } from "../../../../core/api/apiResult";
import type { UserProfileData } from "../entity/update_user_data";
import type { ProfileRepository } from "../repository/profile_repository";

export const GetUserData = (repo: ProfileRepository) => {
  return async (): Promise<ApiResult<UserProfileData>> => {
    return repo.getUserProfile();
  };
};
