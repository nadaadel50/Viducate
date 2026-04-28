import type { Difficulty } from "./difficaulty";
import type { Flashcard } from "./flash_card_entity";

export type FlashcardAnswer = {
  cardInfo:Flashcard
  selectedDifficulty: Difficulty
  retriveTime:number


};