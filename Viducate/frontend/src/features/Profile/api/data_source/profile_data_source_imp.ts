import type { ApiResult } from "../../../../core/api/apiResult";
import handleApiError from "../../../../core/api/apiError";
import { profileService } from "../client/profile_service";
import type { ProfileDataSource } from "../../data/data_source/profile_data_source";
import type { UpdateRequest } from "../../domain/entity/update_req";
import type { UserProfileData } from "../../domain/entity/update_user_data";
import { toUpdateProfileRequestDto } from "../models/update_req_dto";
import { fromUserProfileResponseDto } from "../models/update_response_dto";

export class ProfileDataSourceImp implements ProfileDataSource {
  async deleteAccount(): Promise<ApiResult<string>> {
    try {
      const response = await profileService.deleteAccount();
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  }
  async getUserProfile(): Promise<ApiResult<UserProfileData>> {
    try {
      const response = await profileService.getUserProfile();

      const responseEntity = fromUserProfileResponseDto(response);

      return { success: true, data: responseEntity };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  }

  async updateProfile(req: UpdateRequest): Promise<ApiResult<UserProfileData>> {
    try {
      const response = await profileService.updateProfile(
        toUpdateProfileRequestDto(req),
      );
      const responseEntity = fromUserProfileResponseDto(response);

      return { success: true, data: responseEntity };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  }

  async updateLanguage(language: string): Promise<ApiResult<void>> {
    try {
      await profileService.updateLanguage(language);
      return { success: true, data: undefined };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  }
}
