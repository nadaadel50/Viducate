import { useEffect } from "react";
import { useLocation, useParams } from "react-router";

import { useSegmentSummary } from "./use_segment_summary";
import { useVideoSummary } from "./use_video_summary";

export function useSummaryPage() {
  const { segmentId, videoId: videoIdParam } = useParams();
  const { state: locationState } = useLocation();

  const { videoId: videoIdState } = locationState || {};

  const videoId = Number(videoIdState ?? videoIdParam);
  const parsedSegmentId = segmentId ? Number(segmentId) : undefined;

  const segmentHook = useSegmentSummary();
  const videoHook = useVideoSummary();

  const isSegment = parsedSegmentId !== undefined;

  const { state } = isSegment ? segmentHook : videoHook;

  useEffect(() => {
    if (!videoId) return;

    if (isSegment && parsedSegmentId !== undefined) {
      segmentHook.fetch(videoId, parsedSegmentId);
      return;
    }

    videoHook.fetch(videoId);
  }, [videoId, parsedSegmentId]);

  return {
    state,
    videoId,
    segmentId: parsedSegmentId,
  };
}
