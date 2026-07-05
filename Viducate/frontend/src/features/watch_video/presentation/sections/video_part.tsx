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
import { useIntl } from "react-intl";
import { formatVideoTime } from "../../../../core/utils/fomat_time";

export function VideoPlayer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  const [playerState, setPlayerState] = useState({
    started: false,
    isPlaying: false,
    progress: 0,
    duration: 0,
  });

  const { currentTime, setCurrentTime, selectedTopic, seekTo, setSeekTo } =
    useLearningSession();

  const { data: topics } = useVideoData();

  const [topicStartTime, setTopicStartTime] = useState<number | null>(null);
  const [topicDuration, setTopicDuration] = useState(0);
  const [currentTopicName, setCurrentTopicName] = useState("");
  const hasResumedRef = useRef(false);

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
  const intl = useIntl();
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
    showSpeedMenu,
    playbackRate,
    setShowSpeedMenu,
    handleAddMarker,
  } = useVideoController({
    player: { seek, getCurrentTime, getDuration, setSpeed, play, pause },
    analytics: { addSeekEvent, triggerStuck },
    videoState: { setPlayerState, setCurrentTime },
    topicDuration,
  });

  useEffect(() => {
    setCurrentTopicName(selectedTopic?.title || "");

    if (selectedTopic) {
      setTopicStartTime(Date.now());
      setTopicDuration(
        (selectedTopic.end_time - selectedTopic.start_time) * 1000,
      );
      setTimeSpent(0);
    }
    
  hasResumedRef.current = false; 

    setEvents([]);
  }, [selectedTopic, setEvents, setTimeSpent]);

  
  useEffect(() => {
    if (seekTo === null) return;

    seek(seekTo);

    setSeekTo(null);
  }, [seekTo]);

  useEffect(() => {
    seek(currentTime);

    setPlayerState((p) => ({
      ...p,
      isPlaying: true,
      started: true,
    }));
  }, []);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();

    seek(((e.clientX - rect.left) / rect.width) * getDuration());
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div
        ref={containerRef}
        className="group relative w-full overflow-hidden rounded-lg bg-black shadow-md sm:rounded-xl lg:max-w-5xl"
        style={{
          height: isFullscreen ? "100vh" : "clamp(190px, 34vw, 300px)",
        }}
        onMouseMove={resetHideTimer}
        onMouseLeave={handleMouseLeave}
      >
        <ReactPlayer
          ref={playerRef}
          src={topics?.video_url}
          playing={playerState.isPlaying}
          playbackRate={playbackRate}
          controls={false}
          width="100%"
          height="100%"
          onTimeUpdate={() => handleTimeUpdate()}
          onDurationChange={(e: React.SyntheticEvent<HTMLVideoElement>) => {
            playerRef.current = e.currentTarget;

            if (currentTime > 0 && !hasResumedRef.current) {
              e.currentTarget.currentTime = currentTime;
              hasResumedRef.current = true;
            }

            handleLoadedMetadata();
          }}
          onPlay={handlePlay}
          onPause={handlePause}
          onSeeked={handleSeek}
          onEnded={() =>
            setPlayerState((p) => ({
              ...p,
              isPlaying: false,
            }))
          }
          style={{ objectFit: "cover" }}
        />

        {!playerState.started && <InitialPlayOverlay onStart={handleStart} />}

        {playerState.started && (
          <div
            className={`absolute bottom-0 left-0 right-0 z-30 transition-opacity duration-300 ${
              showControls ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <div className="pointer-events-none absolute inset-0 rounded-b-lg bg-gradient-to-t from-black/75 via-black/25 to-transparent sm:rounded-b-xl" />

            <div className="relative flex flex-col gap-1.5 px-2.5 pb-2.5 pt-5 sm:px-3 sm:pb-3 sm:pt-6">
              <VideoProgressBar
                progress={playerState.progress}
                duration={playerState.duration}
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
          reason={intl.formatMessage({
            id: getStuckMessage(stuckReason),
          })}
          onHelp={() => {
            openChat();

            const subtopic = getClosestSubTopic(
              selectedTopic?.sub_topics ?? [],
              currentTime,
            );

            const questionId = getRandomStuckQuestion();

            const question = intl.formatMessage(
              {
                id: questionId,
              },
              {
                title: subtopic?.name ?? "",
                time: formatVideoTime(currentTime),
              },
            );

            setUserInput(question);
            setShowPopup(false);
          }}
          onDismiss={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}
