import type { AuthRepo } from "../repo/auth_repo";
import type { ApiResult } from "../../../../core/api/apiResult";
import type { User } from "../entity/user";
export class GetCurrentUserUseCase {
  private repository: AuthRepo;
  constructor(repository: AuthRepo) {
    this.repository = repository;
  }
  async execute(): Promise<ApiResult<User>> {
    return await this.repository.getCurrentUser();
  }
}
