export class UploadVideoResponse {
  video_id: number;
  title: string;
  upload_url: string;
  s3_key: string;
  processing_status: string;
  message: string;

  constructor(
    video_id: number,
    title: string,
    upload_url: string,
    s3_key: string,
    processing_status: string,
    message: string,
  ) {
    this.video_id = video_id;
    this.title = title;
    this.upload_url = upload_url;
    this.s3_key = s3_key;
    this.processing_status = processing_status;
    this.message = message;
  }
}
