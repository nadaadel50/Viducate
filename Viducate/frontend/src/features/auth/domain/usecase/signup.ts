import type { AuthRepo } from "../repo/auth_repo";
import type { SignupRequestDto, SignupResponseDto } from '../../api/models/signup/signup_request_dto';

export class SignupUseCase {
  private repository: AuthRepo;

  constructor(repository: AuthRepo) {
    this.repository = repository;
  }

  // الـ execute هي الدالة اللي هناديها من الـ Provider
  async execute(params: SignupRequestDto): Promise<SignupResponseDto> {
    // ممكن هنا نضيف أي Logic زي الـ Analytics أو التحقق من البيانات قبل ما تروح للـ Repo
    return await this.repository.register(params);
  }
}