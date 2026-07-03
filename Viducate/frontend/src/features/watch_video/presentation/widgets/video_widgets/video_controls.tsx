import {
  CirclePlus,
  Gauge,
  Maximize,
  Minimize,
  Pause,
  Play,
} from "lucide-react";
import { FONT_STYLES } from "../../../../../core/constants/fonts";
import { formatVideoTime } from "../../../../../core/utils/fomat_time";
import { FormattedMessage } from "react-intl";
const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

type VideoControlsProps = {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  currentTopicName: string;
  showSpeedMenu: boolean;
  isFullscreen: boolean;
  onToggle: () => void;
  onAddMarker: () => void;
  onSpeedChange: (speed: number) => void;
  onToggleSpeedMenu: () => void;
  onToggleFullscreen: () => void;
};

export function VideoControls({
  isPlaying,
  currentTime,
  duration,
  playbackRate,
  currentTopicName,
  showSpeedMenu,
  isFullscreen,
  onToggle,
  onAddMarker,
  onSpeedChange,
  onToggleSpeedMenu,
  onToggleFullscreen,
}: VideoControlsProps) {
  return (
    <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
      <button
        onClick={onToggle}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-white transition hover:bg-white/20 cursor-pointer"
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>

      <span
        className={`${FONT_STYLES.caption} select-none tabular-nums text-white/80`}
      >
        {formatVideoTime(currentTime)}
        <span className="mx-1 text-white/40">/</span>
        {formatVideoTime(duration)}
      </span>

      <div className="hidden max-w-xl rounded-full bg-gray-500 px-2 py-0.5 sm:block">
        <p className={`${FONT_STYLES.topicDescription} truncate text-white`}>
          {currentTopicName}
        </p>
      </div>

      <div className="flex-1" />

      <button
        onClick={onAddMarker}
        className="flex items-center gap-1 rounded-lg px-2 py-1 text-white/80 transition hover:bg-white/15 hover:text-white cursor-pointer"
      >
        <CirclePlus size={15} />
        <span className="hidden sm:inline text-xs font-medium">
          <FormattedMessage id="watch.video.marker" />
        </span>
      </button>

      <div className="relative">
        <button
          onClick={onToggleSpeedMenu}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-white/80 transition hover:bg-white/15 hover:text-white cursor-pointer"
        >
          <Gauge size={15} />
          <span className="text-xs font-medium">
            {playbackRate === 1 ? (
              <FormattedMessage id="watch.video.speed" />
            ) : (
              `${playbackRate}×`
            )}
          </span>
        </button>

        {showSpeedMenu && (
          <div className="absolute bottom-full right-0 mb-2 min-w-[90px] overflow-hidden rounded-xl border border-white/10 bg-[#1a1a2e]/95 shadow-2xl backdrop-blur-sm">
            {SPEED_OPTIONS.map((speed) => (
              <button
                key={speed}
                onClick={() => onSpeedChange(speed)}
                className={`w-full cursor-pointer px-4 py-2 text-left text-xs transition hover:bg-white/10 ${playbackRate === speed ? "font-semibold text-[#359EFF]" : "text-white/70"}`}
              >
                {speed === 1 ? (
                  <FormattedMessage id="watch.video.normal" />
                ) : (
                  `${speed}×`
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onToggleFullscreen}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/20 hover:text-white cursor-pointer"
      >
        {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
      </button>
    </div>
  );
}
