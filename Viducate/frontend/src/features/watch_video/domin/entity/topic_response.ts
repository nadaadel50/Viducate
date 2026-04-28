export class TopicResponse {
  segment_id: number;
  segment_number: number;
  start_time: number;
  end_time: number;
  main_topic: string;
  title: string;

  constructor(
    segment_id: number,
    segment_number: number,
    start_time: number,
    end_time: number,
    main_topic: string,
    title: string
  ) {
    this.segment_id = segment_id;
    
    this.segment_number = segment_number;
    this.start_time = start_time;
    this.end_time = end_time;
    this.main_topic = main_topic;
    this.title = title;
  }
}