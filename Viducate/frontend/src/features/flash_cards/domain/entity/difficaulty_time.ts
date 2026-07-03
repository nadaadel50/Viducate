import type { Difficulty } from "./difficaulty";

export const DIFFICULTY_TIME: Record<Difficulty, number> = {
  again: 1 * 60 * 1000, // 1 min
  hard: 8 * 60 * 1000, // 8 min
  good: 15 * 60 * 1000, // 15 min
  easy: 24 * 60 * 60 * 1000, // 1 day
};
