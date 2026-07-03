import { apiClient } from "../../../../core/api/apiClient";
import type { UpdateProfileRequestDto } from "../models/update_req_dto";
import type { UserProfileResponseDto } from "../models/update_response_dto";

export class profileService {
  static updateLanguage = (language: string) => {
    return apiClient.put("profile/profile/language", { language });
  };

  static updateProfile = (
    data: UpdateProfileRequestDto,
  ): Promise<UserProfileResponseDto> => {
    return apiClient.patch("/profile/profile/UpdateAccount", data);
  };
  static getUserProfile = async (): Promise<UserProfileResponseDto> => {
    const response = await apiClient.get("/profile/profile/get");

    return response.data;
  };
  static deleteAccount = async (): Promise<string> => {
    const response = await apiClient.delete("/profile/profile/DeleteAccount");

    return response.data;
  };
}
