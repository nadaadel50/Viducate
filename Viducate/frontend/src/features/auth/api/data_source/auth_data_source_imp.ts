import handleApiError from "../../../../core/api/apiError";
import type { ApiResult } from "../../../../core/api/apiResult";
import type { AuthDataSource } from "../../data/data_source/auth_data_source";
import type { ForgetPassReq } from "../../domain/entity/forgetpass_request";
import type { ResetPasswordRequest } from "../../domain/entity/reset_password_request";

import type { AuthApiService } from "../client/auth_service";
import { toForgetPassReqDTO } from "../models/forgetPass/forgetpass_req_dto";
import { toResetPasswordRequestDto } from "../models/forgetPass/reset_password_request_dto";

import { authService } from "../client/auth_service";
import type { LoginResponseDto } from "../../api/models/login/login_response_dto";
import type { LoginRequestDto } from "../models/login/login_request_dto";
import type { SignupRequestDto } from "../models/signup/signup_request_dto";
import type { SignupResponseDto } from "../models/signup/signup_response_dto";
import type { User } from "../../domain/entity/user";
import { toUserEntity } from "../models/user_dto";

export class AuthDataSourceImp implements AuthDataSource {
  private authApiService: AuthApiService;
  constructor(authApiService: AuthApiService) {
    this.authApiService = authApiService;
  }
  async getCurrentUser(): Promise<ApiResult<User>> {
    try {
      const response = await authService.getCurrentUser();
      const responseEntity = toUserEntity(response);
      return {
        success: true,
        data: responseEntity,
      };
    } catch (error) {
      const message = handleApiError(error);
      return { success: false, error: message };
    }
  }
  async resetPassword(
    resetPassReq: ResetPasswordRequest,
  ): Promise<ApiResult<string>> {
    try {
      const response = await this.authApiService.resetPassword(
        toResetPasswordRequestDto(resetPassReq),
      );
      return {
        success: true,
        data: response.message,
      };
    } catch (error) {
      const message = handleApiError(error);
      return { success: false, error: message };
    }
  }
  async forgetPassword(
    forgetPassReq: ForgetPassReq,
  ): Promise<ApiResult<string>> {
    try {
      const response = await this.authApiService.forgetPassword(
        toForgetPassReqDTO(forgetPassReq),
      );

      return { success: true, data: response.message };
    } catch (error) {
      const message = handleApiError(error);
      return { success: false, error: message };
    }
  }
  async login(data: LoginRequestDto): Promise<ApiResult<LoginResponseDto>> {
    try {
      const response = await authService.login(data);

      return { success: true, data: response };
    } catch (error) {
      const message = handleApiError(error);
      return { success: false, error: message };
    }
  }

  async register(
    data: SignupRequestDto,
  ): Promise<ApiResult<SignupResponseDto>> {
    try {
      const response = await authService.register(data);

      return { success: true, data: response };
    } catch (error) {
      const message = handleApiError(error);
      return { success: false, error: message };
    }
  }
}
