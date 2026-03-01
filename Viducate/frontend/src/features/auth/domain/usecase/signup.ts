import type { AuthRepo } from "../repo/auth_repo";
import type { User } from "../entity/user";
export class SignupUseCase {
  private repo: AuthRepo;

  constructor(repo: AuthRepo) {
    this.repo = repo;
  }
  execute(name: string, email: string, password: string): Promise<User> {
    return this.repo.signup(name, email, password)
  }
}