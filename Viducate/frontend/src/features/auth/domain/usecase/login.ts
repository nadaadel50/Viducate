import type { AuthRepo } from "../repo/auth_repo";
import { LoginRequest } from "../entity/login_request";
import type { LoginResponseDto } from "../../api/models/login/login_response_dto";
import type { ApiResult } from "../../../../core/api/apiResult";
export class LoginUseCase {
  private repository: AuthRepo;

  constructor(repository: AuthRepo) {
    this.repository = repository;
  }

  async execute(params: LoginRequest): Promise<ApiResult<LoginResponseDto>> {
    return await this.repository.login(params);
  }
}
