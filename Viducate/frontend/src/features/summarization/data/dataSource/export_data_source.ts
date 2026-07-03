import type { ApiResult } from "../../../../core/api/apiResult";

export interface ExportDataSource {
  downloadVideoSummary(videoId: number): Promise<ApiResult<Blob>>;
  downloadSegmentSummary(
    videoId: number,
    segmentId: number,
  ): Promise<ApiResult<Blob>>;
  downloadVideoStudyNotes(videoId: number): Promise<ApiResult<Blob>>;
  downloadSegmentStudyNotes(
    videoId: number,
    segmentId: number,
  ): Promise<ApiResult<Blob>>;
}
