import { apiClient } from "../../../../core/api/apiClient";
import type { SegmentStudyNotesResponseDto } from "../model/study_notes_dto";
import type { VideoStudyNotesResponseDto } from "../model/study_notes_dto";

export const studyNotesService = {
  getSegmentStudyNotes: (videoId: number, segmentId: number) =>
    apiClient.get<SegmentStudyNotesResponseDto>(
      `studynotes/video/${videoId}/segment/${segmentId}`,
    ),

  getVideoStudyNotes: (videoId: number) =>
    apiClient.get<VideoStudyNotesResponseDto>(`studynotes/video/${videoId}`),
};
