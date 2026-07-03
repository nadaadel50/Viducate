export const Difficulty = {
  Again: "again",
  Hard: "hard",
  Good: "good",
  Easy: "easy",
} as const;

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];
