import type  { LoginRequestDto, LoginResponseDto } from "../../api/models/login/login_request_dto";
import type  { SignupRequestDto, SignupResponseDto } from "../../api/models/signup/signup_request_dto";

export interface AuthDataSource {
  login(data: LoginRequestDto): Promise<LoginResponseDto>;
  register(data: SignupRequestDto): Promise<SignupResponseDto>;
}