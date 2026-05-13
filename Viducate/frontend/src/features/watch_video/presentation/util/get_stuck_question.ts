import { formatMessageTime } from "../../../../core/utils/fomat_time";


export function getRandomStuckQuestion(
  title: string,
  time: number
): string {
  const formattedTime = formatMessageTime(time);

  const topicBadge = `[ 📘 ${title} ]`;
  const timeBadge = `[ ⏱️ ${formattedTime} ]`;

  const stuckQuestions = [
    `Can you explain ${topicBadge} in a simpler way at ${timeBadge}?`,

    `I'm having trouble understanding ${topicBadge} at ${timeBadge}. Can you break it down step by step?`,

    `Can you give me a real-life example to help me understand ${topicBadge} at ${timeBadge}?`,

    `What are the key points I need to know about ${topicBadge} at ${timeBadge}?`,

    `I'm confused about ${topicBadge} at ${timeBadge}. Can you clarify it for me?`,
  ];

  return stuckQuestions[
    Math.floor(Math.random() * stuckQuestions.length)
  ];
}