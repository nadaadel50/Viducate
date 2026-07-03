export interface VideoStatusEntity {
  id: number;
  status:
    | "uploaded"
    | "pending"
    | "processing"
    | "transcribing"
    | "ocr_processing"
    | "merging"
    | "segmenting"
    | "completed"
    | "failed";
  title: string;
}
