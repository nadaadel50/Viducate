  import { useRef, useState } from "react";
  import type { Marker } from "../types/mark_parms";
  import { StuckReasons } from "../types/stuck_reason";

  // ── types ─────────────────────────────────────────────────────────────────────

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
  };


  export function useVideoController({
    player,
    analytics,
    videoState,
  }: ControllerProps) {
    const pauseStartRef = useRef<number | null>(null);
    const lastSeekTimeRef = useRef<number | null>(null);
    const [markers, setMarkers] = useState<Marker[]>([]);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);

    const handleStart = () => {
     // player.play()
    
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
        videoState.setPlayerState((p) => ({
          ...p,
          isPlaying: true,
          
        }));
     
      const pauseStart = pauseStartRef.current;
      const lastSeekTime = lastSeekTimeRef.current;

      if (pauseStart === null || lastSeekTime === null) return;

      const pauseDuration = Date.now() - pauseStart;
      const resumedSameSpot =
        Math.abs(player.getCurrentTime() - lastSeekTime) < 5;

      if (pauseDuration > 60_000 && pauseDuration < 180_000 && resumedSameSpot) {
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

    // time update → progress bar
    const handleTimeUpdate = () => {
      const current = player.getCurrentTime();
      const duration = player.getDuration();
      videoState.setCurrentTime(current);
      if (duration) {
        videoState.setPlayerState((p) => ({ ...p, progress: (current / duration) * 100 }));
      }
    };
    // const handleTimeUpdate = (currentTime: number) => {
    //   videoState.setCurrentTime(currentTime);
    //   const duration = player.getDuration();
    //   if (duration) {
    //     videoState.setPlayerState((p) => ({
    //       ...p,
    //       progress: (currentTime / duration) * 100,
    //     }));
    //   }
    // };

    const handleLoadedMetadata = () => {
      videoState.setPlayerState((p) => ({ ...p, duration:player.getDuration() }));
    };
    
    const handleSeek = () => {
      const time = player.getCurrentTime();
      lastSeekTimeRef.current = time;
      analytics.addSeekEvent(time);
    };

    // speed change
    const handleSpeedChange = (speed: number) => {
      player.setSpeed(speed);
      setPlaybackRate(speed);
      setShowSpeedMenu(false);
    };

    const handleAddMarker = () => {
      setMarkers([...markers, { time: player.getCurrentTime() }]);
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
      markers,
      showSpeedMenu,
      playbackRate,
      setPlaybackRate,
      setShowSpeedMenu,
      handleAddMarker,
    };
  }
