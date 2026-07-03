import { useEffect } from "react";
import { useLocation, useParams } from "react-router";

import { useSegmentStudyNotes } from "./use_segment_study_notes";
import { useVideoStudyNotes } from "./use_video_study_notes";

export function useStudyNotesData() {
  const { segmentId, videoId: videoIdParam } = useParams();
  const { state: locationState } = useLocation();

  const { videoId: videoIdState } = locationState || {};

  const videoId = Number(videoIdState ?? videoIdParam);
  const parsedSegmentId = segmentId ? Number(segmentId) : undefined;

  const isSegment = parsedSegmentId !== undefined;

  const segmentHook = useSegmentStudyNotes();
  const videoHook = useVideoStudyNotes();

  const currentHook = isSegment ? segmentHook : videoHook;

  useEffect(() => {
    if (!videoId) return;

    if (isSegment && parsedSegmentId !== undefined) {
      segmentHook.fetch(videoId, parsedSegmentId);
      return;
    }

    videoHook.fetch(videoId);
  }, [videoId, parsedSegmentId]);

  return {
    state: currentHook.state,
    videoId,
    segmentId: parsedSegmentId,
  };
}
