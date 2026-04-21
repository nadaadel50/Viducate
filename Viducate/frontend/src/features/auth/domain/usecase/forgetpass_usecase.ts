import type { ApiResult } from "../../../../core/api/apiResult";
import type { ForgetPassReq } from "../entity/forgetpass_request";
import type { AuthRepo } from "../repo/auth_repo";

export class ForgetPassUseCase {
  private authRepository: AuthRepo;
  constructor(authRepository: AuthRepo) {
    this.authRepository = authRepository;
  }

  async forgetPass(forgetPassReq: ForgetPassReq): Promise<ApiResult<string>> {
    return await this.authRepository.forgetPassword(forgetPassReq);
  }
}
