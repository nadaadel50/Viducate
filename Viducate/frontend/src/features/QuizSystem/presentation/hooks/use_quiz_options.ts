import { COLORS } from "../../../../core/constants";
import type {
  QuizQuestionEntity,
  QuizSubmitQuestion,
} from "../../domain/entity/quiz_entity";

interface UseQuizOptionsParams {
  question: QuizQuestionEntity;
  selectedId: string | null;
  isReviewMode: boolean;
  submitQuestion?: QuizSubmitQuestion;
}

export const useQuizOptions = ({
  question,
  selectedId,
  isReviewMode,
  submitQuestion,
}: UseQuizOptionsParams) => {
  const options = question.choices;

  const getOptionStyle = (optionId: string) => {
    const isCorrect = submitQuestion
      ? optionId === submitQuestion.correctAnswer
      : false;
    const isSelected = selectedId === optionId;

    const style: React.CSSProperties = {
      border: `2px solid ${COLORS.border.default}`,
      backgroundColor: COLORS.text.white,
    };

    if (isReviewMode && submitQuestion) {
      if (isCorrect) {
        style.border = `2px solid ${COLORS.state.success}`;
        style.backgroundColor = COLORS.state.successLight;
      } else if (isSelected) {
        style.border = `2px solid ${COLORS.state.error}`;
        style.backgroundColor = "#fef2f2";
      }
    } else if (isSelected) {
      style.border = `2px solid ${COLORS.brand.primary}`;
      style.backgroundColor = COLORS.icon.background;
    }

    return { style, isCorrect, isSelected, label: optionId.toUpperCase() };
  };

  return { options, getOptionStyle };
};
