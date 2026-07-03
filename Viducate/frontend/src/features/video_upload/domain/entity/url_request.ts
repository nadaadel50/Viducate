export class UrlRequest {
  url: string;
  title: string;
  language: string;
  subject: string;

  constructor(
    url: string,
    title: string,
    language: string = "en",
    subject: string,
  ) {
    this.url = url;
    this.title = title;
    this.language = language;
    this.subject = subject;
  }
}
