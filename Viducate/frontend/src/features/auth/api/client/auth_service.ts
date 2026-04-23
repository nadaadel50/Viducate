import { apiClient } from "../../../../core/api/apiClient";
import type { ForgetPassReqDTO } from "../models/forgetPass/forgetpass_req_dto";
import type { ForgetPasswordResponseDto } from "../models/forgetPass/forgetpass_response_dto";
import type { ResetPasswordResponseDto } from "../models/forgetPass/reset_pass_response_dto";
import type { ResetPasswordRequestDto } from "../models/forgetPass/reset_password_request_dto";

import type { LoginRequestDto } from '../models/login/login_request_dto';
import type { LoginResponseDto } from "../models/login/login_response_dto";
import type { SignupRequestDto } from '../models/signup/signup_request_dto';
import type { SignupResponseDto } from "../models/signup/signup_response_dto";
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
};
export const authService = {
  
  login: async (data: LoginRequestDto) => {
    const response:LoginResponseDto = await apiClient.post('/auth/login', data);
    
    return response;
  },
  register: async (data: SignupRequestDto) => {
    const response:SignupResponseDto = await apiClient.post('/auth/register', data);
    console.log("i cam to service")
    console.log(response)
    return response;
  },
  
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
  
};
