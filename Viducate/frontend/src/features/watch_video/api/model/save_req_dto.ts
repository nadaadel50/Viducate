import type { SaveVideoReq } from "../../domin/entity/save_video_req";

export type SaveVideoReqDto = {
  video_id: number;
  completed_segment_ids: number[];
  bookmarks: number[];
  current_time: number;
  duration: number;
};

export function mapSaveVideoReqToDto(entity: SaveVideoReq): SaveVideoReqDto {
  return {
    video_id: entity.video_id,
    completed_segment_ids: entity.completed_segment_ids,
    bookmarks: entity.bookmarks.map((b) => Math.floor(b)),
    current_time: Math.floor(entity.current_time),
    duration: Math.floor(entity.duration),
  };
}
