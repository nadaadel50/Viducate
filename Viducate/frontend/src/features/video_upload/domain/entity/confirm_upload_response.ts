export class ConfirmUploadResponse {
  videoId: number;
  processing_status: string;
  message: string;

  constructor(videoId: number, processing_status: string, message: string) {
    this.videoId = videoId;
    this.processing_status = processing_status;
    this.message = message;
  }
}