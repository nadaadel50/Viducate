import type  {  LoginRequestDto, } from "../../api/models/login/login_request_dto";
import type { LoginResponseDto } from "../../api/models/login/login_response_dto";
import type  { SignupRequestDto} from "../../api/models/signup/signup_request_dto";
import type { SignupResponseDto } from "../../api/models/signup/signup_response_dto";

export interface AuthDataSource {
  login(data: LoginRequestDto): Promise<LoginResponseDto>;
  register(data: SignupRequestDto): Promise<SignupResponseDto>;

}