import type { ApiResult } from "../../../../core/api/apiResult";
import type { ForgetPassReq } from "../../domain/entity/forgetpass_request";
import type { ResetPasswordRequest } from "../../domain/entity/reset_password_request";
import type  {  LoginRequestDto, } from "../../api/models/login/login_request_dto";
import type { LoginResponseDto } from "../../api/models/login/login_response_dto";
import type  { SignupRequestDto} from "../../api/models/signup/signup_request_dto";
import type { SignupResponseDto } from "../../api/models/signup/signup_response_dto";

export interface AuthDataSource {
    forgetPassword(forgetPassReq:ForgetPassReq):Promise<ApiResult<string>>
    resetPassword(resetPassReq:ResetPasswordRequest):Promise<ApiResult<string>>
    login(data: LoginRequestDto): Promise<LoginResponseDto>;
    register(data: SignupRequestDto): Promise<SignupResponseDto>;

}