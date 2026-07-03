import type { UserDto } from "../user_dto";

export type LoginResponseDto = {
  access_token: string;
  token_type: string;
  user: UserDto;
};
