import { FONT_STYLES } from "../../../../core/constants/fonts";
import { FormattedMessage } from "react-intl";
type CompleteProgressProps = {
  cardsLenght: number;
  cardNumber: number;
};

export function CompeleteProgress({
  cardsLenght,
  cardNumber,
}: CompleteProgressProps) {
  const progress = cardsLenght > 0 ? (cardNumber / cardsLenght) * 100 : 0;

  return (
    <div className="mb-6 flex w-full max-w-2xl flex-col gap-2 sm:mb-8">
      <div className="mb-1 flex items-end justify-between gap-2">
        <span className={FONT_STYLES.body}>
          <FormattedMessage
            id="flashcards.progress.card"
            values={{
              current: cardNumber + 1,
              total: cardsLenght,
            }}
          />
        </span>

        <span
          className={`${FONT_STYLES.caption} whitespace-nowrap text-[#4f46e5]`}
        >
          <FormattedMessage
            id="flashcards.progress.complete"
            values={{
              percent: Math.round(progress),
            }}
          />
        </span>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-[#4f46e5] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
