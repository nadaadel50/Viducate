import type { ApiResult } from "../../../../core/api/apiResult";
import handleApiError from "../../../../core/api/apiError";
import { summaryService } from "../client/summary_service";
import type {
  VideoSummaryResponseDto,
  SegmentSummaryResponseDto,
} from "../model/summary_dto";
import type { SummaryDataSource } from "../../data/dataSource/summary_data_source";

export class SummaryDataSourceImp implements SummaryDataSource {
  async getVideoSummary(
    videoId: number,
  ): Promise<ApiResult<VideoSummaryResponseDto>> {
    try {
      const res = await summaryService.getVideoSummary(videoId);
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  }

  async getSegmentSummary(
    videoId: number,
    segmentId: number,
  ): Promise<ApiResult<SegmentSummaryResponseDto>> {
    try {
      const res = await summaryService.getSegmentSummary(videoId, segmentId);
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  }
}
