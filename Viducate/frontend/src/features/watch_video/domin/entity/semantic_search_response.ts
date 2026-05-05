export class SemanticSearchResponse {
  segment_number: number;
  start_time: string;
  end_time: string;
  main_topic: string;
  title: string;
  sub_topic_name: string;
//   score: number;

  constructor(
    segment_number: number,
    start_time: string,
    end_time: string,
    main_topic: string,
    title: string,
    sub_topic_name: string,
    //score: number
  ) {
    this.segment_number = segment_number;
    this.start_time = start_time;
    this.end_time = end_time;
    this.main_topic = main_topic;
    this.title = title;
    this.sub_topic_name = sub_topic_name;
    //this.score = score;
  }
}