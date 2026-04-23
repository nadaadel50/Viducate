export class ConfirmUploadResponse {
  videoId: number;
  processing_status: string;
  message: string;

  constructor(videoId: number, processing_status: string, message: string) {
    ((this.message = message),
      (this.processing_status = processing_status),
      (this.videoId = videoId));
  }
}
