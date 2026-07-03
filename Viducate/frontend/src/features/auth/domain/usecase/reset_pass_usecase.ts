import type { ApiResult } from "../../../../core/api/apiResult";
import type { ResetPasswordRequest } from "../entity/reset_password_request";
import type { AuthRepo } from "../repo/auth_repo";

export class ResetPasswordUsecase {
  private authRepository: AuthRepo;
  constructor(authRepository: AuthRepo) {
    this.authRepository = authRepository;
  }

  async resetPass(
    resetPassReq: ResetPasswordRequest,
  ): Promise<ApiResult<string>> {
    return await this.authRepository.resetPassword(resetPassReq);
  }
}
