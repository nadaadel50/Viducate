import type { AuthRepo } from "../repo/auth_repo";
import type { LoginRequestDto } from '../../api/models/login/login_request_dto';

export class LoginUseCase {
  private repository: AuthRepo;

  constructor(repository: AuthRepo) {
    this.repository = repository;
  }

  async execute(params: LoginRequestDto) {
    // ممكن هنا تضيفي أي Logic قبل الإرسال
    return await this.repository.login(params);
  }
}