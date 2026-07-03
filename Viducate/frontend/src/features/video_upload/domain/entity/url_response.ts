export class UrlResponse {
  videoId: number;
  title: string;
  url: string;
  language: string;
  processingStatus: string;
  message: string;

  constructor(
    videoId: number,
    title: string,
    url: string,
    language: string,
    processingStatus: string,
    message: string,
  ) {
    this.videoId = videoId;
    this.title = title;
    this.url = url;
    this.language = language;
    this.processingStatus = processingStatus;
    this.message = message;
  }
}
