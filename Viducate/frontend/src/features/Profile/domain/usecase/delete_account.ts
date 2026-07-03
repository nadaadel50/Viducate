import type { ApiResult } from "../../../../core/api/apiResult";
import type { ProfileRepository } from "../repository/profile_repository";

export const deleteAccount = (repo: ProfileRepository) => {
  return async (): Promise<ApiResult<string>> => {
    return repo.deleteAccount();
  };
};
