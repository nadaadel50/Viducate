import type { SubTopic } from "./sub_topic";

export class TopicResponse {
  segment_id: number;
  segment_number: number;
  start_time: number;
  end_time: number;
  main_topic: string;
  title: string;
  is_completed: boolean;
  sub_topics: SubTopic[];

  constructor(
    segment_id: number,
    segment_number: number,
    start_time: number,
    end_time: number,
    main_topic: string,
    title: string,
    is_completed: boolean,
    sub_topics: SubTopic[],
  ) {
    this.segment_id = segment_id;
    this.segment_number = segment_number;
    this.start_time = start_time;
    this.end_time = end_time;
    this.main_topic = main_topic;
    this.title = title;
    this.is_completed = is_completed;
    this.sub_topics = sub_topics;
  }
}
