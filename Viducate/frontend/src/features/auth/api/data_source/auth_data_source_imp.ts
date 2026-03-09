import handleApiError from "../../../../core/api/apiError";
import type { ApiResult } from "../../../../core/api/apiResult";
import type { AuthDataSource } from "../../data/data_source/auth_data_source";
import type { ForgetPassReq } from "../../domain/entity/forgetpass_request";
import type { ResetPasswordRequest } from "../../domain/entity/reset_password_request";

import type { AuthApiService } from "../client/auth_service";
import { toForgetPassReqDTO } from "../models/forgetPass/forgetpass_req_dto";
import { toResetPasswordRequestDto } from "../models/forgetPass/reset_password_request_dto";

export class AuthDataSourceImp implements AuthDataSource {
  private authApiService: AuthApiService;
  constructor(authApiService: AuthApiService) {
    this.authApiService = authApiService;
  }
  async resetPassword(
    resetPassReq: ResetPasswordRequest,
  ): Promise<ApiResult<string>> {
    try {
      const response = await this.authApiService.resetPassword(
        toResetPasswordRequestDto(resetPassReq),
      );
      console.log(response.message)

      

      return {
        success: true,
        data: response.message,
      };
    } catch (error) {
      const message = handleApiError(error);
      return { success: false, error: message };
    }
  }
  async forgetPassword(forgetPassReq: ForgetPassReq): Promise<ApiResult<string>> {
    try {
      const response =await this.authApiService.forgetPassword(
        toForgetPassReqDTO(forgetPassReq),
      );

      return { success: true, data: response.message };
    } catch (error) {
      console.log(error);
      const message = handleApiError(error);
      return { success: false, error: message };
    }
  }
}
