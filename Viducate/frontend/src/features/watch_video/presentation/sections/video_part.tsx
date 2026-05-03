import { useEffect, useRef, useState } from "react";

import { useVideoData } from "../../../../core/hooks/useVideoData";
import { STORAGE_KEYS } from "../../../../core/constants";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import { useVideoPlayer } from "../hook/useVideoPlayer";
import { useVideoAnalytics } from "../hook/useVideoAnalytics";
import { useVideoUI } from "../hook/use_video_ui";
import { useVideoController } from "../hook/use_video_controller";
import { VideoProgressBar } from "../widgets/video_widgets/video_progress_bar";
import { VideoControls } from "../widgets/video_widgets/video_controls";
import { StuckPopup } from "../widgets/video_widgets/stuck_popup";
import { getStuckMessage } from "../util/get_stuck_message";
import { InitialPlayOverlay } from "../widgets/video_widgets/intial_overLay";
import ReactPlayer from "react-player";

export function VideoPlayer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  const [playerState, setPlayerState] = useState({
    started: false,
    isPlaying: false,
    progress: 0,
    duration: 0,
  });

  const [showTopicEnd, setShowTopicEnd] = useState(false);
  const { currentTime, setCurrentTime, selectedTopic, seekTo, setSeekTo } =
    useLearningSession();
  const { data: topics } = useVideoData();

  const [topicStartTime, setTopicStartTime] = useState<number | null>(null);
  const [topicDuration, setTopicDuration] = useState(0);
  const [currentTopicName, setCurrentTopicName] = useState("");

  // ← playerRef comes from the hook, no argument needed
  const {
    playerRef,

    seek,
    getCurrentTime,
    setSpeed,
    getDuration,
  } = useVideoPlayer();

  const [playbackRate, setPlaybackRate] = useState(1);

  const {
    showPopup,
    stuckReason,
    setShowPopup,
    triggerStuck,
    addSeekEvent,
    setTimeSpent,
    setEvents,
  } = useVideoAnalytics(
    playerState.isPlaying,
    topicDuration,
    getDuration(),
    topicStartTime,
  );

  const {
    isFullscreen,
    showControls,
    toggleFullscreen,
    resetHideTimer,
    handleMouseLeave,
  } = useVideoUI(containerRef, playerState.isPlaying);

  const {
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
    setShowSpeedMenu,
    handleAddMarker,
  } = useVideoController({
    player: { seek, getCurrentTime, getDuration, setSpeed },
    analytics: { addSeekEvent, triggerStuck },
    videoState: { setPlayerState, setCurrentTime, setPlaybackRate },
  });

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.marks, JSON.stringify(markers));
  }, [markers]);

  useEffect(() => {
    setCurrentTopicName(selectedTopic?.title || "");
    if (selectedTopic) {
      setTopicStartTime(Date.now());
      setTopicDuration(
        (selectedTopic.end_time - selectedTopic.start_time) * 1000,
      );
      setTimeSpent(0);
    }
    setEvents([]);
  }, [selectedTopic]);

  useEffect(() => {
    if (seekTo === null) return;
    seek(seekTo);
    setSeekTo(null);
  }, [seekTo]);

  useEffect(() => {
    seek(currentTime);
  }, []);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    seek(((e.clientX - rect.left) / rect.width) * getDuration());
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div
        ref={containerRef}
        className="relative w-full max-w-5xl bg-black rounded-xl overflow-hidden shadow-md group"
        style={{ height: isFullscreen ? "100vh" : "350px" }}
        onMouseMove={resetHideTimer}
        onMouseLeave={handleMouseLeave}
      >
        <ReactPlayer
          ref={playerRef}
          src={topics?.video_url}
          playing={playerState.isPlaying}
          playbackRate={playbackRate}
          onReady={() => {
            const internalPlayer = (
              playerRef.current as any
            )?.getInternalPlayer();
            if (internalPlayer) {
              playerRef.current = internalPlayer;
              internalPlayer.currentTime = currentTime;
            }
          }}
          width="100%"
          height="100%"
          onTimeUpdate={() => handleTimeUpdate()}
          onDurationChange={() => handleLoadedMetadata()}
          // onTimeUpdate={(e: React.SyntheticEvent<HTMLVideoElement>) =>
          //   handleTimeUpdate(e.currentTarget.currentTime)
          // }
          // onDurationChange={(e: React.SyntheticEvent<HTMLVideoElement>) =>
          //   handleLoadedMetadata(e.currentTarget.duration)
          // }
          onPlay={handlePlay}
          onPause={handlePause}
          onSeeked={handleSeek}
          onEnded={() => setPlayerState((p) => ({ ...p, isPlaying: false }))}
          onClick={() => handleToggle(playerState.isPlaying)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {!playerState.started && <InitialPlayOverlay onStart={handleStart} />}

        {playerState.started && (
          <div
            className={`absolute bottom-0 left-0 right-0 z-30 transition-opacity duration-300
              ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none rounded-b-xl" />
            <div className="relative px-4 pb-3 pt-8 flex flex-col gap-2">
              <VideoProgressBar
                progress={playerState.progress}
                duration={playerState.duration}
                markers={markers}
                topics={topics?.topics ?? []}
                getDuration={getDuration}
                onProgressClick={handleProgressClick}
                onMarkerClick={(time) => seek(time)}
                progressRef={progressRef}
              />
              <VideoControls
                isPlaying={playerState.isPlaying}
                currentTime={currentTime}
                duration={playerState.duration}
                playbackRate={playbackRate}
                currentTopicName={currentTopicName}
                showSpeedMenu={showSpeedMenu}
                isFullscreen={isFullscreen}
                onToggle={() => handleToggle(playerState.isPlaying)}
                onAddMarker={handleAddMarker}
                onSpeedChange={handleSpeedChange}
                onToggleSpeedMenu={() => setShowSpeedMenu((p) => !p)}
                onToggleFullscreen={toggleFullscreen}
              />
            </div>
          </div>
        )}
      </div>

      {showPopup && (
        <StuckPopup
          reason={getStuckMessage(stuckReason)}
          onHelp={() => {
            /* open chat */
          }}
          onDismiss={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}
