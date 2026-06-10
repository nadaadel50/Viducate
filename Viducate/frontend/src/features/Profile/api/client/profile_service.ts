
import { apiClient } from "../../../../core/api/apiClient";
import type { UpdateProfileRequestDto } from "../models/update_req_dto";
import type { UserProfileResponseDto } from "../models/update_response_dto";

export class profileService {
  static updateLanguage = (language: string) => {
    return apiClient.put('auth/profile/language', { language });
  };

  static updateProfile = (data: UpdateProfileRequestDto):Promise<UserProfileResponseDto> => {
    return apiClient.patch('/profile/profile', data);
  };
}
