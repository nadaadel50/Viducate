import { QuizRequest } from '../entity/quiz_request';
import { QuizEntity } from '../entity/quiz_entity';

export interface QuizRepository {
  generateVideoQuiz(request: QuizRequest): Promise<{ success: boolean; data?: QuizEntity; error?: string }>;
  generateSegmentQuiz(request: QuizRequest): Promise<{ success: boolean; data?: QuizEntity; error?: string }>;
}