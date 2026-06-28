import { Layers } from "lucide-react";
import { CompeleteProgress } from "../widgets/complete_progress";
import { FlashCard } from "../widgets/flash_card";
import { UserLevelBtn } from "../widgets/user_level_btn";
import { Difficulty } from "../../domain/entity/difficaulty";
import ErrorScreen from "../../../../core/componants/error_screen";
import FinishSessionCard from "../section/finish_flash_cards";
import { GenerationLoadingScreen } from "../../../../core/componants/generation_loading_screen";
import { useFlashcardSession } from "../hooks/use_flash_card_session";
import { useIntl } from "react-intl";
const LoadingView = () => {
  const intl = useIntl();

  return (
    <div className="w-screen flex items-center justify-center">
      <GenerationLoadingScreen
        icon={<Layers />}
        titlePrefix={intl.formatMessage({
          id: "flashcards.loading.titlePrefix",
        })}
        titleHighlight={intl.formatMessage({
          id: "flashcards.loading.titleHighlight",
        })}
        subtitle={intl.formatMessage({
          id: "flashcards.loading.subtitle",
        })}
      />
    </div>
  );
};

export function FlashCards() {
  const {
    flashcardsData,
    isLoading,
    error,
    answers,
    currentIndex,
    isFlipped,
    isFinished,
    totalCards,
    currentCard,
    setIsFlipped,
    handleAnswer,
    resetSession,
  } = useFlashcardSession();

  if (isLoading || !flashcardsData?.length) return <LoadingView />;
  if (error) return <ErrorScreen errorMessage={error.message} />;

  return (
    <div className="w-full  max-w-3xl py-3 bg-white/60 rounded-4xl font-display flex items-center justify-center">
      <div className="relative z-20 w-full">
        {!isFinished && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 w-full max-w-5xl mx-auto">
            <CompeleteProgress
              cardsLenght={totalCards}
              cardNumber={currentIndex}
            />

            <FlashCard
              key={currentIndex}
              cardData={currentCard}
              isFliped={isFlipped}
              onClick={() => setIsFlipped((prev) => !prev)}
            />

            <div
              className={`flex w-full max-w-xl justify-center items-center gap-5 transition-all duration-500
                ${isFlipped ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"}`}
            >
              {(
                [
                  Difficulty.Easy,
                  Difficulty.Good,
                  Difficulty.Hard,
                  Difficulty.Again,
                ] as const
              ).map((d) => (
                <UserLevelBtn
                  key={d}
                  onClick={() => handleAnswer(d)}
                  diffStyle={d}
                />
              ))}
            </div>
          </div>
        )}

        {isFinished && (
          <FinishSessionCard answers={answers} onEndSession={resetSession} />
        )}
      </div>
    </div>
  );
}
