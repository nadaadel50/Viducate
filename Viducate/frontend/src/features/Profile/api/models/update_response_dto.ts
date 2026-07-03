import type { UserProfileData } from "../../domain/entity/update_user_data";

export interface UserProfileResponseDto {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  study_field: string;
  language_preference: string;
  account_status: string;
  created_at: string;
   has_password: boolean;
}

export const fromUserProfileResponseDto = (
  dto: UserProfileResponseDto,
): UserProfileData => ({
  id: dto.id,
  first_name: dto.first_name,
  last_name: dto.last_name,
  email: dto.email,
  study_field: dto.study_field,
  language_preference: dto.language_preference,
 has_password: dto.has_password,
});
