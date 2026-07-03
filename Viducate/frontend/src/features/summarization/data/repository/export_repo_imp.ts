import type { ApiResult } from "../../../../core/api/apiResult";
import type { ExportDataSource } from "../dataSource/export_data_source";
import type { ExportRepository } from "../../domain/repository/export_repository";

export class ExportRepoImp implements ExportRepository {
  private dataSource: ExportDataSource;
  constructor(dataSource: ExportDataSource) {
    this.dataSource = dataSource;
  }

  downloadVideoSummary(videoId: number): Promise<ApiResult<Blob>> {
    return this.dataSource.downloadVideoSummary(videoId);
  }

  downloadSegmentSummary(
    videoId: number,
    segmentId: number,
  ): Promise<ApiResult<Blob>> {
    return this.dataSource.downloadSegmentSummary(videoId, segmentId);
  }

  downloadVideoStudyNotes(videoId: number): Promise<ApiResult<Blob>> {
    return this.dataSource.downloadVideoStudyNotes(videoId);
  }

  downloadSegmentStudyNotes(
    videoId: number,
    segmentId: number,
  ): Promise<ApiResult<Blob>> {
    return this.dataSource.downloadSegmentStudyNotes(videoId, segmentId);
  }
}
