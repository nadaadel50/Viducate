import { useEffect, useMemo, useState } from "react";
import type { FlashcardAnswer } from "../../domain/entity/flash_card_answer";

export function useFinishSession(answers: FlashcardAnswer[]) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const counts = useMemo(() => {
    const result = {
      easy: 0,
      good: 0,
      hard: 0,
      again: 0,
    };

    answers.forEach((answer) => {
      result[answer.selectedDifficulty]++;
    });

    return result;
  }, [answers]);

  const dueCards = useMemo(
    () => answers.filter((card) => card.nextReviewAt <= now),
    [answers, now],
  );

  const nextReviewAt = useMemo(() => {
    if (!answers.length) return null;

    return Math.min(...answers.map((card) => card.nextReviewAt));
  }, [answers]);

  const timeLeft = useMemo(() => {
    if (!nextReviewAt) return 0;

    return Math.max(0, Math.floor((nextReviewAt - now) / 1000));
  }, [nextReviewAt, now]);

  return {
    counts,
    dueCards,
    timeLeft,
  };
}
