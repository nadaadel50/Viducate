import type { ApiResult } from "../../../../core/api/apiResult";
import handleApiError from "../../../../core/api/apiError";
import { exportService } from "../client/export_service";
import type { ExportDataSource } from "../../data/dataSource/export_data_source";

export class ExportDataSourceImp implements ExportDataSource {
  async downloadVideoSummary(videoId: number): Promise<ApiResult<Blob>> {
    try {
      const res = await exportService.downloadVideoSummary(videoId);
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  }

  async downloadSegmentSummary(
    videoId: number,
    segmentId: number,
  ): Promise<ApiResult<Blob>> {
    try {
      const res = await exportService.downloadSegmentSummary(videoId, segmentId);
     
      return { success: true, data: res.data };
    } catch (error) {
     
      return { success: false, error: handleApiError(error) };
    }
  }

  async downloadVideoStudyNotes(videoId: number): Promise<ApiResult<Blob>> {
    try {
      const res = await exportService.downloadVideoStudyNotes(videoId);
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  }

  async downloadSegmentStudyNotes(
    videoId: number,
    segmentId: number,
  ): Promise<ApiResult<Blob>> {
    try {
      const res = await exportService.downloadSegmentStudyNotes(
        videoId,
        segmentId,
      );
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  }
}
