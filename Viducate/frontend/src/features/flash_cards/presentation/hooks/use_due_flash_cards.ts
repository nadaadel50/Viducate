import { useEffect, useState } from "react";
import type { FlashcardAnswer } from "../../domain/entity/flash_card_answer";


type FlashcardSession = {
  segmentId: number;
  answers: FlashcardAnswer[];
  isFinished: boolean;
};
export function useDueFlashcards() {
  const [now, setNow] = useState(Date.now());
    useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

const getAllSessions = (): FlashcardSession[] => {
    return Object.keys(localStorage)
      .filter((key) => key.startsWith("flashcards-session_"))
      .map((key) => JSON.parse(localStorage.getItem(key) ?? "{}"))
      .filter(Boolean);

  };

  const sessions = getAllSessions();

  
  const dueBySegment = sessions.reduce<Record<number, number>>(
    (acc, session) => {
      const due = session.answers.filter((a) => a.nextReviewAt <= now).length;
      if (due > 0) acc[session.segmentId] = due;
      return acc;
    },
    {}
  );
  const totalDue = Object.values(dueBySegment).reduce((a, b) => a + b, 0);

  return {
    dueBySegment,    
    totalDue,        
    hasDueCards: totalDue > 0,
    isDueForSegment: (segmentId: number) => !!dueBySegment[segmentId],
  };

  

}