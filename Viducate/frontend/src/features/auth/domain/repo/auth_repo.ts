import type { ApiResult } from "../../../../core/api/apiResult";
import type { ForgetPassReq } from "../entity/forgetpass_request";
import type { ResetPasswordRequest } from "../entity/reset_password_request";
import { SignupRequest } from "../entity/signup_request";
import { LoginRequest } from "../entity/login_request";
import type { LoginResponseDto } from "../../api/models/login/login_response_dto";
import type { SignupResponseDto } from "../../api/models/signup/signup_response_dto";
import type { User } from "../entity/user";

export interface AuthRepo {
  forgetPassword(forgetPassReq: ForgetPassReq): Promise<ApiResult<string>>;
  resetPassword(resetPassReq: ResetPasswordRequest): Promise<ApiResult<string>>;
  register(entity: SignupRequest): Promise<ApiResult<SignupResponseDto>>;
  login(entity: LoginRequest): Promise<ApiResult<LoginResponseDto>>;
  getCurrentUser(): Promise<ApiResult<User>>;
}
