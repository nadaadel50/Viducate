export interface VideoStatusResponseDto {
  video_id: number;
  title: string;
  processing_status:
    | "uploaded"
    | "pending"
    | "processing"
    | "transcribing"
    | "ocr_processing"
    | "merging"
    | "segmenting"
    | "completed"
    | "failed";
  upload_date: string;
  created_at: string;
}
