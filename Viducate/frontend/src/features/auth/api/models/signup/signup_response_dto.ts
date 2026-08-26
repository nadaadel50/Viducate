import type { UserDto } from "../../../../dashboard/api/models/user_dashboard_dto";

export type SignupResponseDto = {
  message: string;
  user: UserDto;
  token: {
    access_token: string;
    token_type: string;
    user: UserDto;
  };
};
