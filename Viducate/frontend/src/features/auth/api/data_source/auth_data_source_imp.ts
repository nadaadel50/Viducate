import type { AuthDataSource } from "../../data/data_source/auth_data_source";
import { authService } from "../client/auth_service";
import type { LoginResponseDto } from '../../api/models/login/login_response_dto';
import type { LoginRequestDto } from '../models/login/login_request_dto';
import type { SignupRequestDto } from '../models/signup/signup_request_dto';
import type { SignupResponseDto } from '../models/signup/signup_response_dto';

export class AuthDataSourceImp implements AuthDataSource {
  
  async login(data: LoginRequestDto): Promise<LoginResponseDto> {
    return await authService.login(data);
  }

  async register(data: SignupRequestDto): Promise<SignupResponseDto> {
    return await authService.register(data);
  }
}