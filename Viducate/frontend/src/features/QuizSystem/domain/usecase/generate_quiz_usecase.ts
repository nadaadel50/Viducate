import type { QuizRepository } from '../repository/quiz_repository';
import { QuizRequest } from '../entity/quiz_request';
import { QuizEntity } from '../entity/quiz_entity';

export class GenerateQuizUseCase {
  private readonly repo: QuizRepository;

  constructor(repo: QuizRepository) {
    this.repo = repo;
  }

  async generateVideoQuiz(request: QuizRequest): Promise<{ success: boolean; data?: QuizEntity; error?: string }> {
    return this.repo.generateVideoQuiz(request);
  }

  async generateSegmentQuiz(request: QuizRequest): Promise<{ success: boolean; data?: QuizEntity; error?: string }> {
    return this.repo.generateSegmentQuiz(request);
  }
}