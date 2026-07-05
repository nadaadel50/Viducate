import { useRef, useState } from "react";
import { StuckReasons } from "../types/stuck_reason";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";

type PlayerState = {
  started: boolean;
  isPlaying: boolean;
  progress: number;
  duration: number;
};

type PlayerAPI = {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  setSpeed: (speed: number) => void;
};

type AnalyticsAPI = {
  addSeekEvent: (time: number) => void;
  triggerStuck: (reason: "seek_pause" | "repeated_seek" | "time_spent") => void;
};
type VideoStateSetters = {
  setPlayerState: React.Dispatch<React.SetStateAction<PlayerState>>;
  setCurrentTime: (t: number) => void;
};

type ControllerProps = {
  player: PlayerAPI;
  analytics: AnalyticsAPI;
  videoState: VideoStateSetters;
  topicDuration: number;
};

export function useVideoController({
  player,
  analytics,
  videoState,

  topicDuration,
}: ControllerProps) {
  const pauseStartRef = useRef<number | null>(null);
  const lastSeekTimeRef = useRef<number | null>(null);

  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const { setDurationTime, handleAddMark } = useLearningSession();

  const handleStart = () => {
    videoState.setPlayerState((p) => ({
      ...p,
      started: true,
      isPlaying: true,
    }));
  };

  const handleToggle = (isPlaying: boolean) => {
    if (isPlaying) {
      videoState.setPlayerState((p) => ({ ...p, isPlaying: false }));
    } else {
      videoState.setPlayerState((p) => ({
        ...p,
        isPlaying: true,
        started: true,
      }));
    }
  };

  const handlePlay = () => {
    videoState.setPlayerState((p) => {
      if (!p.started) return p;
      return { ...p, isPlaying: true };
    });
    const pauseStart = pauseStartRef.current;
    const lastSeekTime = lastSeekTimeRef.current;

    if (pauseStart === null || lastSeekTime === null) return;

    const pauseDuration = Date.now() - pauseStart;
    const resumedSameSpot =
      Math.abs(player.getCurrentTime() - lastSeekTime) < 5;

    const topicDurationMs = topicDuration || 0;
    const minPause = Math.max(30_000, topicDurationMs * 0.15);
    const maxPause = Math.max(90_000, topicDurationMs * 0.4);

    if (
      pauseDuration > minPause &&
      pauseDuration < maxPause &&
      resumedSameSpot
    ) {
      analytics.triggerStuck(StuckReasons.SEEK_PAUSE);
    }
    pauseStartRef.current = null;
  };

  const handlePause = () => {
    videoState.setPlayerState((p) => ({
      ...p,
      isPlaying: false,
    }));
    pauseStartRef.current = Date.now();
  };

  const handleTimeUpdate = () => {
    const current = player.getCurrentTime();
    const duration = player.getDuration();
    videoState.setCurrentTime(current);
    if (duration) {
      videoState.setPlayerState((p) => ({
        ...p,
        progress: (current / duration) * 100,
      }));
    }
  };

  const handleLoadedMetadata = () => {
    const duration = player.getDuration();

    videoState.setPlayerState((p) => ({
      ...p,
      duration,
    }));

    setDurationTime(duration);
  };

 // use_video_controller.ts
const lastRealTimeRef = useRef<number | null>(null);
const SEEK_JUMP_THRESHOLD = 2;

const handleSeek = () => {
  const time = player.getCurrentTime();
  const lastTime = lastSeekTimeRef.current;
  const now = Date.now();
  const lastReal = lastRealTimeRef.current;

  const videoDelta = lastTime !== null ? time - lastTime : Infinity;
  const realDeltaSec = lastReal !== null ? (now - lastReal) / 1000 : Infinity;

  lastSeekTimeRef.current = time;
  lastRealTimeRef.current = now;

 
  const isNormalPlaybackDrift = Math.abs(videoDelta - realDeltaSec) < 1.5;

  if (Math.abs(videoDelta) < SEEK_JUMP_THRESHOLD || isNormalPlaybackDrift) {
    return;
  }

  analytics.addSeekEvent(time);
};

  const handleSpeedChange = (speed: number) => {
    player.setSpeed(speed);
    setPlaybackRate(speed);
    setShowSpeedMenu(false);
  };

  const handleAddMarker = () => {
    handleAddMark(player.getCurrentTime());
  };
  return {
    handleStart,
    handleToggle,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleSeek,
    handlePlay,
    handlePause,
    handleSpeedChange,
    showSpeedMenu,
    playbackRate,
    setPlaybackRate,
    setShowSpeedMenu,
    handleAddMarker,
  };
}
