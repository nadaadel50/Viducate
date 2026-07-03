import type { ApiResult } from "../../../../core/api/apiResult";
import type {
  VideoSummaryResponseDto,
  SegmentSummaryResponseDto,
} from "../../api/model/summary_dto";

export interface SummaryDataSource {
  getVideoSummary(videoId: number): Promise<ApiResult<VideoSummaryResponseDto>>;
  getSegmentSummary(
    videoId: number,
    segmentId: number,
  ): Promise<ApiResult<SegmentSummaryResponseDto>>;
}
