import { useMutation } from '@tanstack/react-query';
import { generateQuizUseCase } from '../../../../core/di/quiz_container';
import { QuizRequest } from '../../domain/entity/quiz_request';
import { QuizEntity } from '../../domain/entity/quiz_entity';

type Difficulty = 'easy' | 'medium' | 'hard';
type QuizMode = 'video' | 'segment';

interface UseGenerateQuizOptions {
  videoId: number;
  segmentId?: number;
  mode: QuizMode;
  difficulty: Difficulty;
}

export const useGenerateQuiz = ({
  videoId,
  segmentId,
  mode,
  difficulty,
}: UseGenerateQuizOptions) => {

  const mutation = useMutation({
    mutationFn: async (): Promise<QuizEntity> => {

      const request = new QuizRequest(
        videoId,
        difficulty,
        segmentId
      );

      const result =
        mode === 'segment'
          ? await generateQuizUseCase.generateSegmentQuiz(request)
          : await generateQuizUseCase.generateVideoQuiz(request);

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to generate quiz');
      }

      return result.data;
    },
  });

  const generate = () => {
    mutation.mutate();
  };

  return {
    quiz: mutation.data ?? null,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    generate,
  };
};