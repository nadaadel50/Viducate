import type { TopicResponse } from "./topic_response";

export class VideoResponse {
  video_id: number;
  video_url: string;
  topics:TopicResponse[]

  constructor(
    video_url: string,
    video_id: number,
    topics:TopicResponse[]
    
  ) {
    this.video_url = video_url;
    this.video_id = video_id;
    this.topics=topics
   
  }

}