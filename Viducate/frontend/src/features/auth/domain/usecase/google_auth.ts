// src/features/auth/domain/usecase/google_auth.ts

// استوردنا الـ Interface فقط وليس الـ Class الـ Imp
import type { AuthRepo } from "../repo/auth_repo"; 

export class GoogleAuthUseCase {
  private repository: AuthRepo;

  constructor(repository: AuthRepo) {
    this.repository = repository;
  }

  async execute(token: string) {
    // التأكد من أن الـ repository موجود قبل التنفيذ
    if (!this.repository) {
      throw new Error("Repository not initialized");
    }
    return await this.repository.googleAuth(token);
  }
}