import { useMutation } from "@tanstack/react-query";
import { generateQuizUseCase } from "../../../../core/di/quiz_container";
import { QuizRequest } from "../../domain/entity/quiz_request";
import type {
  QuizEntity,
  QuizSubmitResult,
} from "../../domain/entity/quiz_entity";

type Difficulty = "easy" | "medium" | "hard";
type QuizMode = "video" | "segment";

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
  const generateMutation = useMutation({
    mutationFn: async (): Promise<QuizEntity> => {
      const request = new QuizRequest(videoId, difficulty, segmentId);
      const result =
        mode === "segment"
          ? await generateQuizUseCase.generateSegmentQuiz(request)
          : await generateQuizUseCase.generateVideoQuiz(request);

      if (!result.success || !result.data)
        throw new Error(
          !result.success ? result.error : "Failed to generate quiz",
        );
      return result.data;
    },
  });

  const submitMutation = useMutation({
    mutationFn: async ({
      quizId,
      answers,
      questions,
    }: {
      quizId: number;
      answers: Record<string, string>;
      questions: QuizEntity["questions"];
    }): Promise<QuizSubmitResult> => {
      const result = await generateQuizUseCase.submitQuiz(
        quizId,
        answers,
        questions,
      );
      if (!result.success || !result.data)
        throw new Error(
          !result.success ? result.error : "Failed to submit quiz",
        );

      localStorage.setItem(
        `quiz_submit_${quizId}`,
        JSON.stringify(result.data),
      );
      return result.data;
    },
  });

  const getSubmitResult = (quizId?: number): QuizSubmitResult | null => {
    if (submitMutation.data) return submitMutation.data;
    if (!quizId) return null;
    const saved = localStorage.getItem(`quiz_submit_${quizId}`);
    return saved ? JSON.parse(saved) : null;
  };

  return {
    quiz: generateMutation.data ?? null,
    isPending: generateMutation.isPending,
    isError: generateMutation.isError,
    generateQuizError: generateMutation.error?.message,
    generate: () => generateMutation.mutate(),
    submitQuiz: (
      quizId: number,
      answers: Record<string, string>,
      questions: QuizEntity["questions"],
    ) => submitMutation.mutate({ quizId, answers, questions }),
    getSubmitResult,
    isSubmitting: submitMutation.isPending,
    submitError: submitMutation.error?.message,
  };
};
