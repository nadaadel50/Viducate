import { useEffect, useState } from "react";
import type { FlashcardAnswer } from "../../domain/entity/flash_card_answer";
import { STORAGE_KEYS } from "../../../../core/constants";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";

type FlashcardSession = {
  segmentId: number;
  answers: FlashcardAnswer[];
  isFinished: boolean;
};
export function useDueFlashcards() {
  const { videoId } = useLearningSession();
  const [now, setNow] = useState(Date.now());

  const videoSession = videoId
    ? JSON.parse(
        sessionStorage.getItem(
          `${STORAGE_KEYS.flashcardSession}_video_${videoId}`,
        ) ?? "null",
      )
    : null;

  const videoDueCards: FlashcardAnswer[] =
    videoSession?.answers?.filter(
      (answer: FlashcardAnswer) => answer.nextReviewAt <= now,
    ) ?? [];

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);
  const getAllSessions = (): FlashcardSession[] => {
    return Object.keys(sessionStorage)
      .filter((key) => key.startsWith(`${STORAGE_KEYS.flashcardSession}_`))
      .map((key) => {
        const parsed = JSON.parse(sessionStorage.getItem(key) ?? "{}");

        return { ...parsed, segmentId: parsed.segmentId || null };
      })
      .filter(Boolean);
  };
  const sessions = getAllSessions();

  const dueBySegment = sessions.reduce<Record<number, number>>(
    (acc, session) => {
      const due = session.answers.filter((a) => a.nextReviewAt <= now).length;
      if (due > 0) acc[session.segmentId] = due;
      return acc;
    },
    {},
  );
  const totalDue = Object.values(dueBySegment).reduce((a, b) => a + b, 0);

  return {
    dueBySegment,
    totalDue,
    hasDueCards: totalDue > 0,
    videoDueCards,
    isDueForSegment: (segmentId: number) => !!dueBySegment[segmentId],
  };
}
