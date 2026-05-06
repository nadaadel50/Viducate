import { useState } from 'react';
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
  onSuccess: (quiz: QuizEntity) => void;
}

export const useGenerateQuiz = ({ videoId, segmentId, mode, onSuccess }: UseGenerateQuizOptions) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (selectedDifficulty: Difficulty) => {
      const request = new QuizRequest(videoId, selectedDifficulty, segmentId);
      const result =
        mode === 'segment'
          ? await generateQuizUseCase.generateSegmentQuiz(request)
          : await generateQuizUseCase.generateVideoQuiz(request);

      if (!result.success || !result.data) throw new Error(result.error ?? 'Failed to generate quiz');
      return result.data;
    },
    onSuccess,
  });

  const generate = (selectedDifficulty?: Difficulty) => {
    const d = selectedDifficulty ?? difficulty;
    setDifficulty(d);
    mutate(d);
  };

  return { generate, isPending, isError, error, difficulty, setDifficulty };
};