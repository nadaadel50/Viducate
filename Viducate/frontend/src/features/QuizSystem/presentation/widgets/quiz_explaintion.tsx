import { COLORS } from "../../../../core/constants";
import { FONT_SIZE } from "../../../../core/constants/fonts_update";

interface QuizExplanationProps {
  explanation: string;
}

export function QuizExplanation({ explanation }: QuizExplanationProps) {
  return (
    <div
      className={`${FONT_SIZE.size12} rounded-lg p-3 bg-yellow-50`}
      style={{
        color: COLORS.text.secondary,
      }}
    >
      💡 {explanation}
    </div>
  );
}
