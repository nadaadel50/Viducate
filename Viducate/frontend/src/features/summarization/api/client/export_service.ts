import { apiClient } from "../../../../core/api/apiClient";

export const exportService = {
  downloadVideoSummary: (videoId: number) =>
    apiClient.get(`export/summary/video/${videoId}`, { responseType: "blob" }),

  downloadSegmentSummary: (videoId: number, segmentId: number) =>
    apiClient.get(`export/summary/video/${videoId}/segment/${segmentId}`, {
      responseType: "blob",
    }),

  downloadVideoStudyNotes: (videoId: number) =>
    apiClient.get(`export/studynotes/video/${videoId}`, {
      responseType: "blob",
    }),

  downloadSegmentStudyNotes: (videoId: number, segmentId: number) =>
    apiClient.get(`export/studynotes/video/${videoId}/segment/${segmentId}`, {
      responseType: "blob",
    }),
};
