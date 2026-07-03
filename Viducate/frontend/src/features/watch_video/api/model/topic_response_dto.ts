import type { SubTopicDto } from "./sub_topic_dto";

export type TopicResponseDto = {
  segment_id: number;
  video_id: number;
  segment_number: number;
  start_time: number;
  end_time: number;
  main_topic: string;
  title: string;
  is_completed: boolean;
  sub_topics: SubTopicDto[];
};
