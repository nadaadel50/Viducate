import { useEffect, useRef, useState } from "react";
import {
  CirclePlus,
  Pause,
  Play,
  Maximize,
  Minimize,
  Gauge,
} from "lucide-react";

import { useVideoData } from "../../../../core/hooks/useVideoData";
import { STORAGE_KEYS } from "../../../../core/constants";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import { useVideoPlayer } from "../hook/useVideoPlayer";
import { useVideoAnalytics } from "../hook/useVideoAnalytics";
import { useVideoUI } from "../hook/use_video_ui";
import { useVideoController } from "../hook/use_video_controller";
import { VideoProgressBar } from "../widgets/video_progress_bar";
import { VideoControls } from "../widgets/video_controls";
import { StuckPopup } from "../widgets/stuck_popup";
import { getStuckMessage } from "../util/get_stuck_message";

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  const [playerState, setPlayerState] = useState({
    started: false,
    isPlaying: false,
    progress: 0,
    duration: 0,
  });

  const [showTopicEnd, setShowTopicEnd] = useState(false);

  const [events, setEvents] = useState<{ time: number; timestamp: number }[]>(
    [],
  );
  const { currentTime, setCurrentTime, selectedTopic, seekTo, setSeekTo } =
    useLearningSession();
  const { data: topics } = useVideoData();

  const [topicStartTime, setTopicStartTime] = useState<number | null>(null);

  const [topicDuration, setTopicDuration] = useState(0);

  const [currentTopicName, setCurrentTopicName] = useState("");

  const { play, pause, seek, getCurrentTime, setSpeed, getDuration } =
    useVideoPlayer(videoRef);
  const [playbackRate, setPlaybackRate] = useState(1);

  // const [markers, setMarkers] = useState<Marker[]>([]);

  const {
    showPopup,
    stuckReason,
    setShowPopup,
    triggerStuck,
    addSeekEvent,
    setTimeSpent,
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
    player: { play, pause, seek, getCurrentTime, getDuration, setSpeed },
    analytics: { addSeekEvent, triggerStuck },
    videoState: {
      setPlayerState,
      setCurrentTime,
      setPlaybackRate,
  
    },
  });

  // this fn to handle marks
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.marks, JSON.stringify(markers));
  }, [markers]);

  // this fn to handle topic change by listen to every change to selectedTopic so if change this fn work and setStart time to time of the new topic
  useEffect(() => {
    setCurrentTopicName(selectedTopic?.title || "");
    if (selectedTopic && videoRef.current) {
      setTopicStartTime(Date.now());
      setTopicDuration(
        (selectedTopic.end_time - selectedTopic.start_time) * 1000,
      );
      setTimeSpent(0); // this for stuck detection
    }
    setEvents([]);
  }, [selectedTopic]);

  // when i click on the left section then change the current time so i  want the video player to progress to new currenct time
  useEffect(() => {
    if (seekTo === null || !videoRef.current) return;
    seek(seekTo);
    setSeekTo(null);
  }, [seekTo]);

  // take it from local storage when reload the page for first time
  useEffect(() => {
    seek(currentTime);
  }, []);

  // ── handlers ──────────────────────────────────────────────────────────────

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    seek((clickX / rect.width) * getDuration());
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* ── outer container (also the fullscreen root) ── */}
      <div
        ref={containerRef}
        className="relative w-full max-w-5xl bg-black rounded-xl overflow-hidden shadow-md group"
        style={{ height: isFullscreen ? "100vh" : "350px" }}
        onMouseMove={() => {
          resetHideTimer();
        }}
        onMouseLeave={() => {
          handleMouseLeave();
        }}
      >
        <video
          ref={videoRef}
          src={topics?.video_url}
          onSeeked={handleSeek}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={() => {
            setPlayerState((prev) => ({ ...prev, isPlaying: false }));
            setShowTopicEnd(true);
          }}
          onClick={() => {
            handleToggle(playerState.isPlaying);
          }}
          className="w-full h-full object-cover cursor-pointer"
        />

        {/* initial play button */}
        {!playerState.started && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <button
              onClick={handleStart}
              className="cursor-pointer bg-gradient-to-br from-[#359EFF]/70 to-[#5A0BB1]/70
                hover:from-[#5A0BB1] hover:to-[#359EFF]
                text-white p-5 rounded-full transition-all duration-300 scale-100 hover:scale-110"
            >
              <Play className="w-8 h-8" />
            </button>
          </div>
        )}

        {/* ── custom controls bar ── */}
        {playerState.started && (
          <div
            className={`absolute bottom-0 left-0 right-0 z-30 transition-opacity duration-300 
              ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            {/* gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none rounded-b-xl" />

            <div className="relative px-4 pb-3 pt-8 flex flex-col gap-2">
              {/* progress bar */}
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

              {/* bottom row */}
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

      {/* stuck popup */}
      {showPopup && <StuckPopup reason={getStuckMessage(stuckReason)} onHelp={()=>{
        // open chat
      } } onDismiss={()=>{
        setShowPopup(false)
      } }/>}

      {/* topic-end overlay
      <div
        onClick={() => {
          setShowTopicEnd(false);
        }}
        className={`fixed inset-0 z-50
    flex items-center justify-center 
    bg-black/60 transition-all duration-500
    ${
      showTopicEnd
        ? " opacity-100 pointer-events-auto"
        : "opacity-0 pointer-events-none"
    }
  `}
      >
        <TopicEndSection />
      </div> */}
    </div>
  );
}
