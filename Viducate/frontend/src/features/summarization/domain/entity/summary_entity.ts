export type ContentItem = {
  text: string;
  type: "term" | "normal";
  tooltip?: string;
  highlights?: string[];
};

export type SummarySection = {
  heading: string;
  content: ContentItem[];
};
export type ReadingTime = {
  words: number;
  minutes: number;
  label: string;
};
export type SummaryContent = {
  takeaways: string[];
  sections: SummarySection[];
  conclusion: string;
};

export type VideoSummary = {
  videoId: number;
  title: string;
  summary: SummaryContent;
  language: string;
  createdAt: string;
  readingTime: ReadingTime;
};

export type SegmentSummary = {
  segmentId: number;
  segmentNumber: number;
  title: string;
  startTime: number;
  endTime: number;
  summary: SummaryContent;
  language: string;
  generationFailed: boolean;
  readingTime: ReadingTime;
};
