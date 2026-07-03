import type {
  VideoSummaryResponseDto,
  SegmentSummaryResponseDto,
} from "../../api/model/summary_dto";
import type {
  VideoSummary,
  SegmentSummary,
} from "../../domain/entity/summary_entity";

export function mapVideoSummary(dto: VideoSummaryResponseDto): VideoSummary {
  return {
    videoId: dto.video_id,
    title: dto.title,
    summary: dto.summary,
    language: dto.language,
    createdAt: dto.created_at,
    readingTime: dto.reading_time,
  };
}

export function mapSegmentSummary(
  dto: SegmentSummaryResponseDto,
): SegmentSummary {
  return {
    segmentId: dto.segment_id,
    segmentNumber: dto.segment_number,
    title: dto.title,
    startTime: dto.start_time,
    endTime: dto.end_time,
    summary: dto.summary,
    language: dto.language,
    generationFailed: dto.generation_failed,
    readingTime: dto.reading_time,
  };
}
