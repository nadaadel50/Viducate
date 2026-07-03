import type { ApiResult } from "../../../../core/api/apiResult";
import type { VideoSummary, SegmentSummary } from "../entity/summary_entity";

export interface SummaryRepository {
  getVideoSummary(videoId: number): Promise<ApiResult<VideoSummary>>;
  getSegmentSummary(
    videoId: number,
    segmentId: number,
  ): Promise<ApiResult<SegmentSummary>>;
}
