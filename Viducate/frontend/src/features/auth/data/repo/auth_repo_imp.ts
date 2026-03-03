
import type { AuthRepo } from "../../domain/repo/auth_repo";
import type { AuthDataSource } from "../data_source/auth_data_source";
import type { SignupRequestDto, SignupResponseDto } from "../../api/models/signup/signup_request_dto";
import type{ LoginRequestDto, LoginResponseDto } from "../../api/models/login/login_request_dto";

export class AuthRepoImp implements AuthRepo {
  private dataSource: AuthDataSource;

  // هنا بنعمل Dependency Injection للـ DataSource
  constructor(dataSource: AuthDataSource) {
    this.dataSource = dataSource;
  }

  async register(data: SignupRequestDto): Promise<SignupResponseDto> {
    // الـ Repo هنا ممكن يعمل Logic إضافي زي تحويل البيانات (Mapping) لو محتاجه
    return await this.dataSource.register(data);
  }

  async login(data: LoginRequestDto): Promise<LoginResponseDto> {
    return await this.dataSource.login(data);
  }
}