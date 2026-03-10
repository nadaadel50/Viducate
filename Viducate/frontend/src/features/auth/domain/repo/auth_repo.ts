import { SignupRequest } from "../entity/signup_request";
import { LoginRequest } from "../entity/login_request";
import type { LoginResponseDto } from "../../api/models/login/login_response_dto";
import type { SignupResponseDto } from "../../api/models/signup/signup_response_dto";

export interface AuthRepo {
  register(entity: SignupRequest): Promise<SignupResponseDto>;
  login(entity: LoginRequest): Promise<LoginResponseDto>;
}