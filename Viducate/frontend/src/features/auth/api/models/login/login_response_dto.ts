import type { UserDto } from "../../../../dashboard/api/models/user_dashboard_dto";

export type LoginResponseDto = {
  access_token: string;
  token_type: string;
  user: UserDto;
};
