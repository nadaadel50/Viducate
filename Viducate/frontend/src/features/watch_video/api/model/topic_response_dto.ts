import { TopicResponse } from "../../domin/entity/topic_response"

export type TopicResponseDto = {
  segment_id: number
  video_id: number
  segment_number: number
  start_time: number
  end_time: number
  main_topic: string
  title: string
}


export function toTopicResponseEntity(dto: TopicResponseDto): TopicResponse {
  return new TopicResponse(
    dto.segment_id,
    dto.video_id,
    dto.segment_number,
    dto.start_time,
    dto.end_time,
    dto.main_topic,
    dto.title
  )
}