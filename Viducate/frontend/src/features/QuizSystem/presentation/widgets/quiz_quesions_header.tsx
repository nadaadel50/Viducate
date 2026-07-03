import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import { AppRoutesNames } from "../../../../app/routers/routes";
import { COLORS} from "../../../../core/constants";
import {
  FONT_SIZE,
  FONT_WEIGHT,
  LETTER_SPACING,
} from "../../../../core/constants/fonts_update";
import { QuizQuestionEntity } from "../../domain/entity/quiz_entity";
import { FONT_STYLES } from "../../../../core/constants/fonts";

interface QuizQuestionHeaderProps {
  question: QuizQuestionEntity;
  isReviewMode: boolean;
}

export function QuizQuestionHeader({
  question,
  isReviewMode,
}: QuizQuestionHeaderProps) {
  const navigate = useNavigate();
  const { setCurrentTime, setSeekTo } = useLearningSession();

  const handleWatch = () => {
    if (question.video_timestamp == null) return;
  

    setCurrentTime(question.video_timestamp);
    setSeekTo(question.video_timestamp);

    navigate(AppRoutesNames.watchVideo);
  };

  return (
    <div className="space-y-4 px-1">
      <h2
        className={`${FONT_STYLES.quizTitle} ${FONT_WEIGHT.bold} ${LETTER_SPACING.tight}`}
        style={{ color: COLORS.text.primary }}
      >
        {question.question_text}
      </h2>

      {isReviewMode && question.video_timestamp != null && (
        <button
          onClick={handleWatch}
          className="flex w-fit bg-white/40 hover:bg-white cursor-pointer items-center gap-2 rounded-lg px-3 py-2 shadow-sm transition-all hover:scale-[1.02] active:scale-95"
          style={{
            color: COLORS.brand.primary,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            play_circle
          </span>

          <span
            className={`${FONT_SIZE.size11} ${FONT_WEIGHT.semibold} ${LETTER_SPACING.wide} uppercase`}
          >
            <FormattedMessage
              id="quiz.go_to_watch"
              values={{
                timestamp_label: question.timestamp_label,
              }}
            />
          </span>
        </button>
      )}
    </div>
  );
}
