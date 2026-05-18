import type { TimeMarker } from "./mark";

export type SaveVideoReq = {
    video_id: number;
    completed_segment_ids: number[];
    bookmarks: TimeMarker[];
    current_time: number;
    duration: number;

}