import type { SubTopic } from "../../domin/entity/sub_topic";

export function getClosestSubTopic(
  subTopics: SubTopic[],
  currentTime: number,
): SubTopic | null {
  if (subTopics.length === 0) return null;

  let closest = subTopics[0];

  for (const subTopic of subTopics) {
    if (
      Math.abs(subTopic.start_time - currentTime) <
      Math.abs(closest.start_time - currentTime)
    ) {
      closest = subTopic;
    }
  }

  return closest;
}
