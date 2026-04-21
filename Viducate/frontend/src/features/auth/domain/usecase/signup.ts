import type { AuthRepo } from "../repo/auth_repo";
import { SignupRequest } from "../entity/signup_request"; 
import type { SignupResponseDto } from "../../api/models/signup/signup_response_dto";
export class SignupUseCase {
  private repository: AuthRepo;
  constructor(repository: AuthRepo) {
    this.repository = repository;
  }
async execute(params: SignupRequest): Promise<SignupResponseDto> { 
    return await this.repository.register(params);
  }
}