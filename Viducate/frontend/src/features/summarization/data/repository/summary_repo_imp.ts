import type { ApiResult } from "../../../../core/api/apiResult";
import type { SummaryDataSource } from "../dataSource/summary_data_source";
import type { SummaryRepository } from "../../domain/repository/summary_repository";
import type {
  VideoSummary,
  SegmentSummary,
} from "../../domain/entity/summary_entity";
import { mapVideoSummary, mapSegmentSummary } from "./summary_mapper";

export class SummaryRepoImp implements SummaryRepository {
  private dataSource: SummaryDataSource;

  constructor(dataSource: SummaryDataSource) {
    this.dataSource = dataSource;
  }

  async getVideoSummary(videoId: number): Promise<ApiResult<VideoSummary>> {
    const result = await this.dataSource.getVideoSummary(videoId);
    if (!result.success) return result;
    return { success: true, data: mapVideoSummary(result.data) };
  }

  async getSegmentSummary(
    videoId: number,
    segmentId: number,
  ): Promise<ApiResult<SegmentSummary>> {
    const result = await this.dataSource.getSegmentSummary(videoId, segmentId);
    if (!result.success) return result;
    return { success: true, data: mapSegmentSummary(result.data) };
  }
}
