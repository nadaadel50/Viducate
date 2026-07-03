export class SemanticSearchRequest {
  query: string;
  videoId: number;

  constructor(query: string, videoId: number) {
    ((this.query = query), (this.videoId = videoId));
  }
}
