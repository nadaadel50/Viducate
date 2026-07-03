export class UploadVideoRequest {
  file: File;
  filename: string;
  title: string;
  language: string;
  subject: string;
  content_type: string;
  file_size: number;

  constructor(
    file: File,
    filename: string,
    title: string,
    language: string,
    subject: string,
    content_type: string,
    file_size: number,
  ) {
    this.file = file;
    this.filename = filename;
    this.title = title;
    this.language = language;
    this.subject = subject;
    this.content_type = content_type;
    this.file_size = file_size;
  }
}
