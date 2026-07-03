export type StudyNotesContentItem = {
  text: string;
  type: "term" | "important" | "normal";
  tooltip?: string;
};

export type StudyNotesDefinition = {
  term: string;
  meaning: string;
};

export type StudyNotesTable = {
  title: string;
  headers: string[];
  rows: string[][];
};

export type StudyNotesSection = {
  heading: string;
  explanation: StudyNotesContentItem[];
  definitions?: StudyNotesDefinition[];
  examples?: string[];
  tables?: StudyNotesTable[];
  notes?: string[];
};
export type ReadingTime = {
  words: number;
  minutes: number;
  label: string;
};
export type StudyNotesContent = {
  title: string;
  introduction: string;
  sections: StudyNotesSection[];
};

export type SegmentStudyNotes = {
  segmentId: number;
  segmentNumber: number;
  title: string;
  startTime: number;
  endTime: number;
  language: string;
  studyNotes: StudyNotesContent;
  generationFailed: boolean;
  readingTime: ReadingTime;
};
export type VideoStudyNotes = {
  videoId: number;
  language: string;
  cached: boolean;
  studyNotes: StudyNotesContent;
  createdAt: string;
  readingTime: ReadingTime;
};
