import { useMemo } from "react";
import { COLORS } from "../../../../core/constants";

interface Question {
  question_text: string;
  choices: Record<string, string>;
  correct_answer: string;
}

interface UseQuizOptionsParams {
  question: Question;
  selectedId: string | null;
  isReviewMode: boolean;
}

export const useQuizOptions = ({
  question,
  selectedId,
  isReviewMode,
}: UseQuizOptionsParams) => {

  // will remove
  const options = useMemo(() => {
    if (!question?.choices) return [];

    return Object.entries(question.choices).map(([key, value]) => ({
      id: key,
      text: value,
    }));
  }, [question]);


  const getOptionStyle = (optionId: string) => {
    const isCorrect = optionId === question.correct_answer;
    const isSelected = selectedId === optionId;

    const style: React.CSSProperties = {
      border: `2px solid ${COLORS.border.default}`,
      backgroundColor: COLORS.text.white,
    };

    if (isReviewMode) {
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

    return {
      style,
      isCorrect,
      isSelected,
      label: optionId.toUpperCase(),
    };
  };

  return {
    options,
    getOptionStyle,
  };
};