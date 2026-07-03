export function getRandomStuckQuestion(): string {
  const questions = [
    "watch.stuck.question.simple",
    "watch.stuck.question.breakdown",
    "watch.stuck.question.example",
    "watch.stuck.question.keyPoints",
    "watch.stuck.question.clarify",
  ];

  return questions[Math.floor(Math.random() * questions.length)];
}
