export type SaveVideoReq = {
  video_id: number;
  completed_segment_ids: number[];
  bookmarks: number[];
  current_time: number;
  duration: number;
};
