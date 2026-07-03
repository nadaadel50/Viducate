export class ConfirmUploadResponse {
  videoId: number;
  title: string;
  processing_status: string;
  message: string;

  constructor(
    videoId: number,
    title: string,
    processing_status: string,
    message: string,
  ) {
    this.videoId = videoId;
    this.title = title;
    this.processing_status = processing_status;
    this.message = message;
  }
}
