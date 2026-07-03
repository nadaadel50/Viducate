import type { MouseEvent, RefObject } from "react";
import { useLearningSession } from "../../../../../core/hooks/useLearningContent";
import type { TopicResponse } from "../../../domin/entity/topic_response";

type VideoProgressBarProps = {
  progress: number;
  duration: number;
  topics: TopicResponse[];
  getDuration: () => number;
  onProgressClick: (e: MouseEvent<HTMLDivElement>) => void;
  onMarkerClick: (time: number) => void;
  progressRef: RefObject<HTMLDivElement | null>;
};

export function VideoProgressBar({
  progress,
  duration,
  topics,
  getDuration,
  onProgressClick,
  onMarkerClick,
  progressRef,
}: VideoProgressBarProps) {
  const { marks } = useLearningSession();

  return (
    <div
      ref={progressRef}
      onClick={onProgressClick}
      className="group/bar relative h-1.5 w-full cursor-pointer rounded-full bg-white/25 sm:h-2"
    >
      <div
        className="relative h-full rounded-full bg-gradient-to-r from-[#359EFF] to-[#5A0BB1]"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 scale-0 rounded-full bg-white shadow-md transition-transform group-hover/bar:scale-100 sm:h-3 sm:w-3" />
      </div>

      <div className="pointer-events-none absolute inset-0">
        {topics.map((topic) => (
          <div
            key={topic.segment_id}
            className="absolute top-0 h-full w-[2px] bg-white/70"
            style={{
              left: `${(topic.end_time / duration) * 100}%`,
            }}
          />
        ))}
      </div>

      {(marks ?? []).map((marker, index) => (
        <div
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            onMarkerClick(marker);
          }}
          className="absolute top-1/2 -translate-y-1/2"
          style={{
            left: `${(marker / (getDuration() || 1)) * 100}%`,
          }}
        >
          <div className="flex h-3 w-3 cursor-pointer items-center justify-center rounded-full bg-white shadow transition hover:scale-125 sm:h-3.5 sm:w-3.5">
            <div className="h-1.5 w-1.5 rounded-full bg-[#4338ca]/60" />
          </div>
        </div>
      ))}
    </div>
  );
}
