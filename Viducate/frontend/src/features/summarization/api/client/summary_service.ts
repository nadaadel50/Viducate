import { apiClient } from "../../../../core/api/apiClient";
import type {
  VideoSummaryResponseDto,
  SegmentSummaryResponseDto,
} from "../model/summary_dto";

export const summaryService = {
  getVideoSummary: (videoId: number) =>
    apiClient.get<VideoSummaryResponseDto>(`summaries/video/${videoId}`),

  getSegmentSummary: (videoId: number, segmentId: number) =>
    apiClient.get<SegmentSummaryResponseDto>(
      `summaries/video/${videoId}/segment/${segmentId}`,
    ),
};
