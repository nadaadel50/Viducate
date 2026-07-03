import { FilePlay } from "lucide-react";
import { useNavigate } from "react-router";
import clsx from "clsx";

import { AppRoutesNames } from "../../../../app/routers/routes";
import { CustomButton } from "../../../../core/componants/custum_btn";
import { FONT_STYLES } from "../../../../core/constants/fonts";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import { formatVideoTime } from "../../../../core/utils/fomat_time";
import { FormattedMessage } from "react-intl";
import type { FlashCardDetials } from "../../domain/entity/flash_card_response";

type FlashCardProps = {
  cardData: FlashCardDetials;
  isFliped: boolean;
  onClick: () => void;
};

export function FlashCard({ cardData, isFliped, onClick }: FlashCardProps) {
  const navigate = useNavigate();
  const { setCurrentTime, setSeekTo } = useLearningSession();

  const handleViewSource = () => {
    setCurrentTime(cardData.segment_start_time);
    setSeekTo(cardData.segment_start_time);

    navigate(AppRoutesNames.watchVideo);
  };

  return (
    <div
      onClick={onClick}
      style={{ perspective: "1000px" }}
      className="group relative mb-8 h-[300px] w-full max-w-2xl cursor-pointer sm:h-[360px] lg:h-[420px]"
    >
      <div
        className={clsx(
          "relative h-full w-full rounded-2xl border border-slate-100 bg-white shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),_0_10px_10px_-5px_rgba(0,0,0,0.04)] transition-all duration-700 [transform-style:preserve-3d]",
          isFliped && "rotate-y-180",
        )}
      >
        {/* Front */}
        <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center rounded-2xl bg-white p-5 sm:p-8 lg:p-12">
          <h3
            className={clsx(
              FONT_STYLES.pageTitle,
              "text-center text-slate-900",
            )}
          >
            {cardData.question}
          </h3>

          <p
            className={clsx(
              FONT_STYLES.caption,
              "mt-8 text-center uppercase tracking-widest text-slate-400",
            )}
          >
            <FormattedMessage id="flashcards.card.reveal" />
          </p>
        </div>

        {/* Back */}
        <div className="absolute inset-0 flex h-full w-full rotate-y-180 flex-col items-center justify-center gap-5 rounded-2xl bg-white p-5 [backface-visibility:hidden] sm:p-8 lg:p-12">
          <p
            className={clsx(
              FONT_STYLES.sectionTitle,
              "text-center text-[#4f46e5]",
            )}
          >
            {cardData.answer}
          </p>

          <p
            className={clsx(
              FONT_STYLES.caption,
              "text-center uppercase tracking-widest text-slate-400",
            )}
          >
            <FormattedMessage id="flashcards.card.back" />
          </p>
        </div>
      </div>

      <div
        className={clsx(
          "absolute bottom-4 left-1/2 -translate-x-1/2 transition-all duration-300",
          isFliped
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <CustomButton
          type="button"
          onClick={handleViewSource}
          className="gap-2 whitespace-nowrap rounded-lg bg-transparent px-3 py-2 text-slate-500 hover:text-[#4f46e5]"
          leftIcon={<FilePlay size={18} />}
        >
          <FormattedMessage
            id="flashcards.card.viewSource"
            values={{
              time: formatVideoTime(cardData.segment_start_time),
            }}
          />
        </CustomButton>
      </div>
    </div>
  );
}
