import { FormattedMessage } from "react-intl";

import { COLORS } from "../../../../core/constants";
import {
  FONT_SIZE,
  FONT_WEIGHT,
  LETTER_SPACING,
} from "../../../../core/constants/fonts_update";

type Question = {
  question_id: number;
};

type AnswersMap = Record<string | number, unknown>;

interface QuestionMapProps {
  questions: Question[];
  currentIndex: number;
  answers: AnswersMap;
  onNavigate: (index: number) => void;
}

export function QuestionMap({
  questions,
  currentIndex,
  answers,
  onNavigate,
}: QuestionMapProps) {
  return (
    <section
      className="rounded-xl border bg-white p-4 shadow-sm md:p-5"
      style={{ borderColor: COLORS.border.default }}
    >
      <h3
        className={`mb-3 ${FONT_SIZE.size12} ${FONT_WEIGHT.bold} ${LETTER_SPACING.wide} uppercase`}
        style={{ color: COLORS.text.secondary }}
      >
        <FormattedMessage id="quiz.map_title" />
      </h3>

      <div className="grid grid-cols-5 gap-2">
        {questions.map((question, index) => {
          const isCurrent = index === currentIndex;
          const isAnswered = Boolean(answers[question.question_id]);

          const buttonStyle: React.CSSProperties = {
            backgroundColor: COLORS.state.pending,
            color: COLORS.text.secondary,
            border: "2px solid transparent",
          };

          if (isCurrent) {
            buttonStyle.backgroundColor = COLORS.icon.background;
            buttonStyle.color = COLORS.brand.primary;
            buttonStyle.border = `2px solid ${COLORS.brand.primary}`;
          } else if (isAnswered) {
            buttonStyle.backgroundColor = COLORS.brand.primary;
            buttonStyle.color = COLORS.text.white;
          }

          return (
            <button
              key={question.question_id}
              onClick={() => onNavigate(index)}
              className={`p-3 rounded-lg transition-all hover:brightness-95 flex items-center justify-center ${FONT_SIZE.size13} ${FONT_WEIGHT.semibold}`}
              style={buttonStyle}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </section>
  );
}
