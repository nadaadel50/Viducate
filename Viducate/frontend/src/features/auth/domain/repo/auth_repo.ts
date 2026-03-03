import type { SignupRequestDto, SignupResponseDto } from '../../api/models/signup/signup_request_dto';
import type { LoginRequestDto, LoginResponseDto } from '../../api/models/login/login_request_dto';

export interface AuthRepo {
  register(data: SignupRequestDto): Promise<SignupResponseDto>;
  login(data: LoginRequestDto): Promise<LoginResponseDto>;
}