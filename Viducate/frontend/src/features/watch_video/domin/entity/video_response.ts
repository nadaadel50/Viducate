import type { TopicResponse } from "./topic_response";

export class VideoResponse {
  video_id: number;
  title: string;
  video_url: string;
  current_time: number;
  last_watched_at: string;
  bookmarks: number[];
  topics: TopicResponse[];

  constructor(
    video_url: string,
    video_id: number,
    title: string,
    current_time: number,
    last_watched_at: string,
    bookmarks: number[],
    topics: TopicResponse[],
  ) {
    this.video_url = video_url;
    this.video_id = video_id;
    this.topics = topics;
    this.title = title;
    this.current_time = current_time;
    this.last_watched_at = last_watched_at;
    this.bookmarks = bookmarks;
  }
}
