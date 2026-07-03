export type ContentItemDto = {
  text: string;
  type: "term" | "normal";
  tooltip?: string;
  highlights?: string[];
};

export type SectionDto = {
  heading: string;
  content: ContentItemDto[];
};
export type ReadingTimeDto = {
  words: number;
  minutes: number;
  label: string;
};
export type SummaryDto = {
  takeaways: string[];
  sections: SectionDto[];
  conclusion: string;
};

export type VideoSummaryResponseDto = {
  video_id: number;
  title: string;
  summary: SummaryDto;
  language: string;
  created_at: string;
  cached: boolean;
  reading_time: ReadingTimeDto;
};

export type SegmentSummaryResponseDto = {
  segment_id: number;
  segment_number: number;
  title: string;
  start_time: number;
  end_time: number;
  summary: SummaryDto;
  language: string;
  generation_failed: boolean;
  reading_time: ReadingTimeDto;
};
