
import type { ApiResult } from "../../../../core/api/apiResult";
import type { ForgetPassReq } from "../../domain/entity/forgetpass_request";
import type { ResetPasswordRequest } from "../../domain/entity/reset_password_request";
import type { AuthRepo } from "../../domain/repo/auth_repo";
import type { AuthDataSource } from "../data_source/auth_data_source";
import { SignupRequest } from "../../domain/entity/signup_request";
import { LoginRequest } from "../../domain/entity/login_request";
import { toSignupRequestDto } from "../../api/models/signup/signup_request_dto";
import type { SignupResponseDto } from "../../api/models/signup/signup_response_dto";
import { toLoginRequestDto } from "../../api/models/login/login_request_dto";
import type { LoginResponseDto } from "../../api/models/login/login_response_dto";


export class AuthRepoImp implements AuthRepo {
    private AuthDataSource: AuthDataSource;
    constructor(AuthDataSource: AuthDataSource) {
        this.AuthDataSource = AuthDataSource;
    }
    resetPassword(resetPassReq: ResetPasswordRequest): Promise<ApiResult<string>> {
        return this.AuthDataSource.resetPassword(resetPassReq)
    }
    forgetPassword(forgetPassReq: ForgetPassReq): Promise<ApiResult<string>> {
        return this.AuthDataSource.forgetPassword(forgetPassReq)
    }
   


  async register(entity: SignupRequest): Promise<SignupResponseDto> {
    const dto = toSignupRequestDto(entity);
    return await this.AuthDataSource.register(dto);
  }

  async login(entity: LoginRequest): Promise<LoginResponseDto> {
    const dto = toLoginRequestDto(entity);
    return await this.AuthDataSource.login(dto);
  }
}