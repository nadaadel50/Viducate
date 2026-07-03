import { useEffect, useRef, useState } from "react";
import { StuckReasons, type StuckReason } from "../types/stuck_reason";

function detectRepeatedSeek(events: { time: number; timestamp: number }[]) {
  const now = Date.now();
  const WINDOW_MS = 180_000;
  const POSITION_THRESHOLD_S = 60;
  const MIN_OCCURRENCES = 3;

  const recent = events.filter((e) => now - e.timestamp < WINDOW_MS);

  const clusters = new Map<number, { time: number; timestamp: number }[]>();

  for (const event of recent) {
    const key = [...clusters.keys()].find(
      (k) => Math.abs(k - event.time) < POSITION_THRESHOLD_S,
    );

    if (key !== undefined) {
      clusters.get(key)!.push(event);
    } else {
      clusters.set(event.time, [event]);
    }
  }

  for (const group of clusters.values()) {
    if (group.length < MIN_OCCURRENCES) {
      continue;
    }

    const timestamps = group.map((e) => e.timestamp).sort((a, b) => a - b);

    const spread = timestamps[timestamps.length - 1] - timestamps[0];

    if (spread > 5000) {
      return true;
    }
  }

  return false;
}
export function useVideoAnalytics(
  isPlaying: boolean,
  topicDuration: number,
  videoDuration: number,
  topicStartTime: number | null,
) {
  const [events, setEvents] = useState<{ time: number; timestamp: number }[]>(
    [],
  );
  const [showPopup, setShowPopup] = useState(false);
  const lastPopupTimeRef = useRef(0);
  const [stuckReason, setStuckReason] = useState<StuckReason>(
    StuckReasons.DEAFULT,
  );
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (topicStartTime && isPlaying) setTimeSpent((p) => p + 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, [topicStartTime, isPlaying]);

  useEffect(() => {
    if (!timeSpent) return;

    if (videoDuration && timeSpent > topicDuration * 2) {
      triggerStuck(StuckReasons.TIME_SPENT);
    }
  }, [timeSpent, topicDuration, videoDuration]);

  function triggerStuck(reason: StuckReason) {
    if (Date.now() - lastPopupTimeRef.current < 120000) return;

    setShowPopup(true);
    lastPopupTimeRef.current = Date.now();
    setStuckReason(reason);
  }

  const addSeekEvent = (time: number) => {
    const newEvent = {
      time,
      timestamp: Date.now(),
    };

    setEvents((prev) => {
      const updated = [...prev, newEvent];

      if (detectRepeatedSeek(updated)) {
        triggerStuck(StuckReasons.REPEATED_SEEK);
      }

      return updated;
    });
  };

  return {
    timeSpent,
    showPopup,
    stuckReason,
    setTimeSpent,
    setShowPopup,
    triggerStuck,
    addSeekEvent,
    setEvents,
  };
}
