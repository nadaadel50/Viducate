import { apiClient } from "../../../../core/api/apiClient";
import type { ApiResult } from "../../../../core/api/apiResult";
import type { ForgetPassReqDTO } from "../models/forgetPass/forgetpass_req_dto";
import type { ForgetPasswordResponseDto } from "../models/forgetPass/forgetpass_response_dto";
import type { ResetPasswordResponseDto } from "../models/forgetPass/reset_pass_response_dto";
import type { ResetPasswordRequestDto } from "../models/forgetPass/reset_password_request_dto";

export class AuthApiService {
  async forgetPassword(
    forgetpassReqDTO: ForgetPassReqDTO,
  ): Promise<ForgetPasswordResponseDto> {
    const response = await apiClient.post(
      `/auth/forgot-password`,
      forgetpassReqDTO,
    );
    return response.data;
  }



  async resetPassword(resetPassReqDto: ResetPasswordRequestDto): Promise<ResetPasswordResponseDto> {
    const response = await apiClient.post(
      `/auth/reset-password`,
      resetPassReqDto,
    );
    return response.data;
  }
}
