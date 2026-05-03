import { Pause, Play, CirclePlus, Gauge, Maximize, Minimize } from "lucide-react";

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

type Props = {
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

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

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
}: Props) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onToggle}
        className="w-8 h-8 flex items-center justify-center rounded-lg
          text-white hover:bg-white/20 transition cursor-pointer"
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>

      <span className="text-xs text-white/80 tabular-nums select-none">
        {formatTime(currentTime)}
        <span className="text-white/40 mx-1">/</span>
        {formatTime(duration)}
      </span>

      <div className="bg-gray-500 rounded-full px-2 py-0.5 ml-2">
        <p className="text-xs text-white/80">{currentTopicName}</p>
      </div>

      <div className="flex-1" />

      <button
        onClick={onAddMarker}
        className="flex items-center gap-1.5 text-white/80 hover:text-white
          text-xs font-medium px-2 py-1 rounded-lg hover:bg-white/15 transition cursor-pointer"
      >
        <CirclePlus size={15} />
        <span className="hidden sm:inline">Marker</span>
      </button>

      <div className="relative">
        <button
          onClick={onToggleSpeedMenu}
          className="flex items-center gap-1.5 text-white/80 hover:text-white
            text-xs font-medium px-2 py-1 rounded-lg hover:bg-white/15 transition cursor-pointer"
        >
          <Gauge size={15} />
          <span>{playbackRate === 1 ? "Speed" : `${playbackRate}×`}</span>
        </button>

        {showSpeedMenu && (
          <div className="absolute bottom-full right-0 mb-2 bg-[#1a1a2e]/95 border border-white/10
            rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm min-w-[90px]">
            {SPEED_OPTIONS.map((speed) => (
              <button
                key={speed}
                onClick={() => onSpeedChange(speed)}
                className={`w-full text-left px-4 py-2 text-xs transition
                  hover:bg-white/10 cursor-pointer
                  ${playbackRate === speed ? "text-[#359EFF] font-semibold" : "text-white/70"}`}
              >
                {speed === 1 ? "Normal" : `${speed}×`}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onToggleFullscreen}
        className="w-8 h-8 flex items-center justify-center rounded-lg
          text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
      >
        {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
      </button>
    </div>
  );
}