export class QuizRequest {
  public readonly videoId: number;
  public readonly difficulty: "easy" | "medium" | "hard";
  public readonly segmentId?: number;

  constructor(
    videoId: number,
    difficulty: "easy" | "medium" | "hard",
    segmentId?: number,
  ) {
    this.videoId = videoId;
    this.difficulty = difficulty;
    this.segmentId = segmentId;
  }
}
