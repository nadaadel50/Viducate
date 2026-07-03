import type { AuthRepo } from "../repo/auth_repo";
import { SignupRequest } from "../entity/signup_request";
import type { SignupResponseDto } from "../../api/models/signup/signup_response_dto";
import type { ApiResult } from "../../../../core/api/apiResult";
export class SignupUseCase {
  private repository: AuthRepo;
  constructor(repository: AuthRepo) {
    this.repository = repository;
  }
  async execute(params: SignupRequest): Promise<ApiResult<SignupResponseDto>> {
    return await this.repository.register(params);
  }
}
