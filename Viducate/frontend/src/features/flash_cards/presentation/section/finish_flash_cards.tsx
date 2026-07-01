import CompleteSessionAnimation from "../../../../core/animations/complete_ani";
import { CustomButton } from "../../../../core/componants/custum_btn";
import { FONT_STYLES } from "../../../../core/constants/fonts";
import { formatVideoTime } from "../../../../core/utils/fomat_time";
import { FormattedMessage } from "react-intl";
import type { FlashcardAnswer } from "../../domain/entity/flash_card_answer";
import { useFinishSession } from "../hooks/use_finish_flash_cards";
import { StatCard } from "../widgets/state_card";
import { useIntl } from "react-intl";
type Props = {
  answers: FlashcardAnswer[];
  onEndSession: (dueCards?: FlashcardAnswer[]) => void;
};

export function FinishSessionCard({ answers, onEndSession }: Props) {
  const { counts, dueCards, timeLeft } = useFinishSession(answers);
  const intl = useIntl();
  return (
    <div className="mx-auto flex flex-1 flex-col items-center justify-center gap-8 p-6 sm:gap-10 sm:p-10">
      <CompleteSessionAnimation />

      <div className="text-center">
        <p className={`${FONT_STYLES.body} text-gray-700`}>
          <FormattedMessage id="flashcards.finish.nextReview" />
        </p>

        <div className="mt-3">
          {dueCards.length > 0 ? (
            <CustomButton
              onClick={() => onEndSession(dueCards)}
              className="group rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-3 text-white shadow-lg hover:scale-105 hover:shadow-xl"
            >
              <span className="flex items-center gap-2 text-lg">
                <FormattedMessage id="flashcards.finish.reviewNow" />
                <span className="text-lg group-hover:animate-bounce">😎</span>
              </span>
            </CustomButton>
          ) : (
            <p className={`${FONT_STYLES.pageTitle}`}>
              {formatVideoTime(timeLeft)}
            </p>
          )}
        </div>
      </div>

      <div className="grid w-full max-w-xl grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          title={intl.formatMessage({ id: "flashcards.level.easy" })}
          value={counts.easy}
          color="green"
        />
        <StatCard
          title={intl.formatMessage({ id: "flashcards.level.good" })}
          value={counts.good}
          color="blue"
        />
        <StatCard
          title={intl.formatMessage({ id: "flashcards.level.hard" })}
          value={counts.hard}
          color="yellow"
        />
        <StatCard
          title={intl.formatMessage({ id: "flashcards.level.again" })}
          value={counts.again}
          color="red"
        />{" "}
      </div>

      <div className="relative mt-2 flex w-full flex-col items-center">
        <CustomButton
          fullWidth
          onClick={() => onEndSession()}
          className="group rounded-2xl border border-[#4f46e5]/40 bg-white/70 text-[#4f46e5] backdrop-blur-md shadow-md hover:scale-[1.02] hover:shadow-xl"
        >
          <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
            <FormattedMessage id="flashcards.finish.endSession" />
          </span>

          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#359EFF] to-[#5A0BB1] opacity-0 transition duration-300 group-hover:opacity-100" />
        </CustomButton>

        <p
          className={`${FONT_STYLES.caption} absolute -bottom-6 text-center text-gray-500`}
        >
          <FormattedMessage id="flashcards.finish.resetDescription" />
        </p>
      </div>
    </div>
  );
}

export default FinishSessionCard;
