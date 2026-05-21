import type { ApiResult } from "../../../../core/api/apiResult";
import handleApiError from "../../../../core/api/apiError";
import { profileService } from "../client/profile_service";
import type { ProfileDataSource } from "../../data/data_source/profile_data_source";

export class ProfileDataSourceImp implements ProfileDataSource {
  async updateLanguage(language: string): Promise<ApiResult<void>> {
    try {
      await profileService.updateLanguage(language);
      return { success: true, data: undefined };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  }
}