export interface VideoStatusResponseDto {
  video_id: number;
  title: string;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  upload_date: string;
  created_at: string;
}