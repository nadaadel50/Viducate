export type StudyNotesContentItemDto = {
  text: string;
  type: "term" | "important" | "normal";
  tooltip?: string;
};

export type StudyNotesDefinitionDto = {
  term: string;
  meaning: string;
};

export type StudyNotesTableDto = {
  title: string;
  headers: string[];
  rows: string[][];
};
export type ReadingTimeDto = {
  words: number;
  minutes: number;
  label: string;
};
export type StudyNotesSectionDto = {
  heading: string;
  explanation: StudyNotesContentItemDto[];
  definitions?: StudyNotesDefinitionDto[];
  examples?: string[];
  tables?: StudyNotesTableDto[];
  notes?: string[];
};

export type StudyNotesDto = {
  title: string;
  introduction: string;
  sections: StudyNotesSectionDto[];
};

export type SegmentStudyNotesResponseDto = {
  segment_id: number;
  segment_number: number;
  title: string;
  start_time: number;
  end_time: number;
  language: string;
  study_notes: StudyNotesDto;
  generation_failed: boolean;
  reading_time: ReadingTimeDto;
};
export type VideoStudyNotesResponseDto = {
  video_id: number;
  language: string;
  cached: boolean;
  study_notes: StudyNotesDto;
  created_at: string;
  reading_time: ReadingTimeDto;
};
