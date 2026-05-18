import type { TimeMarker } from "../../../domin/entity/mark";
import type { TopicResponse } from "../../../domin/entity/topic_response";




type Props = {
  progress: number;
  duration: number;
  markers: TimeMarker[];
  topics: TopicResponse[];
  getDuration: () => number;
  onProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMarkerClick: (time: number) => void;
  progressRef: React.RefObject<HTMLDivElement|null>;
};

export function VideoProgressBar({
  progress,
  duration,
  markers,
  topics,
  getDuration,
  onProgressClick,
  onMarkerClick,
  progressRef,
}: Props) {
  return (
    <div
      ref={progressRef}
      className="w-full h-1.5 bg-white/25 rounded-full cursor-pointer relative group/bar"
      onClick={onProgressClick}
    >
      <div
        className="h-full bg-gradient-to-r from-[#359EFF] to-[#5A0BB1] rounded-full relative"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md scale-0 group-hover/bar:scale-100 transition-transform" />
      </div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {topics.map((topic, i) => (
          <div
            key={i}
            className="absolute top-0 h-full w-[2px] bg-white/70"
            style={{ left: `${(topic.end_time / duration) * 100}%` }}
          />
        ))}
      </div>

      {markers.map((marker, i) => (
        <div
          key={i}
          className="absolute top-1/2 -translate-y-1/2"
          style={{ left: `${(marker.time / (getDuration() || 1)) * 100}%` }}
          onClick={(e) => {
            e.stopPropagation();
            onMarkerClick(marker.time);
          }}
        >
          <div className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center shadow hover:scale-125 transition cursor-pointer">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4338ca]/60" />
          </div>
        </div>
      ))}
    </div>
  );
}