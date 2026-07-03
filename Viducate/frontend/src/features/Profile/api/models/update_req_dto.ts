import type { UpdateRequest } from "../../domain/entity/update_req";

export interface UpdateProfileRequestDto {
  first_name: string;
  last_name: string;
  current_password: string;
  new_password: string;
}

export const toUpdateProfileRequestDto = (
  profile: UpdateRequest,
): UpdateProfileRequestDto => ({
  first_name: profile.first_name,
  last_name: profile.last_name,
  current_password: profile.current_password,
  new_password: profile.new_password,
});
