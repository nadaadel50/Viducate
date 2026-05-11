import type { Difficulty } from "./difficaulty";

export type FlashcardAnswer = {
  cardId: number;
  selectedDifficulty: Difficulty;
  nextReviewAt: number;
};
