export const SECONDS_PER_QUESTION: Record<"easy" | "medium" | "hard", number> =
  {
    easy: 30,
    medium: 50,
    hard: 75,
  };

export function calculateQuizTime(
  totalQuestions: number,
  difficulty: "easy" | "medium" | "hard",
) {
  return (totalQuestions * SECONDS_PER_QUESTION[difficulty]) / 60;
}
