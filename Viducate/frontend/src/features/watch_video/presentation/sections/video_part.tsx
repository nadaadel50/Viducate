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
import { useChat } from "../../../chat_bot/presenation/hooks/use_chat";
import { getClosestSubTopic } from "../util/get_subtopic";
import { getRandomStuckQuestion } from "../util/get_stuck_question";

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

  const {
    play,
    pause,
    playerRef,
    seek,
    getCurrentTime,
    setSpeed,
    getDuration,
  } = useVideoPlayer();
  const { openChat, setUserInput } = useChat();

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
    playbackRate,
    setShowSpeedMenu,
    handleAddMarker,
  } = useVideoController({
    player: { seek, getCurrentTime, getDuration, setSpeed, play, pause },
    analytics: { addSeekEvent, triggerStuck },
    videoState: { setPlayerState, setCurrentTime },
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
  }, [selectedTopic, setEvents, setTimeSpent]);

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
          controls={false}
          // onReady={() => {
          //   // check if the video player is ready to use or not (not the react player)
          //   const internalPlayer = (
          //     playerRef.current as any
          //   )?.getInternalPlayer();
          //   if (internalPlayer) {
          //     console.log("iam in interanl the time is", currentTime);
          //     playerRef.current = internalPlayer;
          //     internalPlayer.currentTime = currentTime;
          //   }
          // }}
          width="100%"
          height="100%"
          onTimeUpdate={() => handleTimeUpdate()}
          onDurationChange={(e: React.SyntheticEvent<HTMLVideoElement>) => {
            playerRef.current = e.currentTarget;
            if (currentTime > 0) {
              e.currentTarget.currentTime = currentTime;
            }
            handleLoadedMetadata();
          }}
          onPlay={handlePlay}
          onPause={handlePause}
          onSeeked={handleSeek}
          onEnded={() => setPlayerState((p) => ({ ...p, isPlaying: false }))}
          // onClick={() => handleToggle(playerState.isPlaying)}
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
      openChat();
      const subtopic = getClosestSubTopic(
        selectedTopic?.sub_topics ?? [],
        currentTime,
      );

      const question=getRandomStuckQuestion(subtopic?.name??"",currentTime)

      setUserInput(question);
      setShowPopup(false);
    }}
    onDismiss={() => setShowPopup(false)}
  />
)}
    </div>
  );
}