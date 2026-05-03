import { useEffect, useState } from "react";
import { StuckReasons, type StuckReason } from "../../domin/entity/stuck_reason";

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
  const [lastPopupTime, setLastPopupTime] = useState(0);
  const [stuckReason, setStuckReason] = useState<StuckReason>(StuckReasons.DEAFULT);
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

  function detectRepeatedSeek(events: { time: number; timestamp: number }[]) {
    const now = Date.now();
    const lastMinute = events.filter((e) => now - e.timestamp < 60000);

    const clusters: number[][] = [];

    for (const event of lastMinute) {
      const existing = clusters.find((c) =>
        c.some((t) => Math.abs(t - event.time) < 5),
      );

      if (existing) existing.push(event.time);
      else clusters.push([event.time]);
    }

    return clusters.some((c) => c.length >= 3);
  }

  function triggerStuck(reason: StuckReason) {
    if (Date.now() - lastPopupTime < 120000) return;

    setShowPopup(true);
    setLastPopupTime(Date.now());
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
  };
}
