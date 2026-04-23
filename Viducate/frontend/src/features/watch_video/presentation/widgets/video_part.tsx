import { useEffect, useRef, useState } from "react";
import {
  CirclePlus,
  Pause,
  Play,
  Maximize,
  Minimize,
  Gauge,
} from "lucide-react";
import video from "../../../../assets/videos/test.mp4";
import { useSelectedTopic } from "../context/topic_context";
import { useVideoData } from "../../../../core/hooks/useVideoData";
import { STORAGE_KEYS } from "../../../../core/constants";

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

type Marker = {
  time: number;
};

export function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [pause, setPause] = useState(false);
  const [showTopicEnd, setShowTopicEnd] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [markers, setMarkers] = useState<Marker[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.marks);
    return saved ? JSON.parse(saved) : [];
  });
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [events, setEvents] = useState<{ time: number; timestamp: number }[]>(
    [],
  );
  const { currentTime, setCurrentTime, selectedTopic, seekTo, setSeekTo } =
    useSelectedTopic();
  const { data: topics } = useVideoData();
  const [lastSeekTime, setLastSeekTime] = useState<number | null>(null);
  const [pauseStart, setPauseStart] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [lastPopupTime, setLastPopupTime] = useState(0);
  const [topicStartTime, setTopicStartTime] = useState<number | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [topicDuration, setTopicDuration] = useState(0);
  const [stuckReason, setStuckReason] = useState<string | null>(null);
  const [currentTopicName, setCurrentTopicName] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.marks, JSON.stringify(markers));
  }, [markers]);
  // ── topic change ──────────────────────────────────────────────────────────
  useEffect(() => {
    console.log("topics in video player:", topics);
    setCurrentTopicName(selectedTopic?.title || "");
    if (selectedTopic && videoRef.current) {
      setTopicStartTime(Date.now());
      setTopicDuration(
        (selectedTopic.end_time - selectedTopic.start_time) * 1000,
      );
      setTimeSpent(0);
    }
    setEvents([]);
  }, [selectedTopic]);

  useEffect(() => {
    if (seekTo === null || !videoRef.current) return;

    videoRef.current.currentTime = seekTo;
    setSeekTo(null);
  }, [seekTo]);

     useEffect(() => {
    
    if(!videoRef.current) return
    videoRef.current.currentTime=currentTime
  }, []);


  // ── time-spent tracking ───────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      if (topicStartTime && pause) setTimeSpent((p) => p + 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, [topicStartTime, pause]);

  useEffect(() => {
    if (topicDuration && timeSpent > topicDuration * 2) {
      triggerStuck("user spending too much time on topic");
    }
  }, [timeSpent, topicDuration]);

  // ── fullscreen sync ───────────────────────────────────────────────────────
  useEffect(() => {

    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);



  // ── auto-hide controls in fullscreen ─────────────────────────────────────
  const resetHideTimer = () => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    if (isFullscreen && pause) {
      hideControlsTimer.current = setTimeout(
        () => setShowControls(false),
        3000,
      );
    }
  };

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    };
  }, [isFullscreen, pause]);

  // ── helpers ───────────────────────────────────────────────────────────────
  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  }

  function detectRepeatedSeek(events: { time: number; timestamp: number }[]) {
    const now = Date.now();
    const lastMinute = events.filter((e) => now - e.timestamp < 60000);
    const clusters: number[][] = [];
    for (const event of lastMinute) {
      const existing = clusters.find((c) =>
        c.some((t) => Math.abs(t - event.time) < 5),
      );
      if (existing) existing.push(event.time);
      else clusters.push([event.time]);
    }
    return clusters.some((c) => c.length >= 3);
  }

  function triggerStuck(reason: string) {
    if (Date.now() - lastPopupTime < 120000) return;
    setShowPopup(true);
    setLastPopupTime(Date.now());
    setStuckReason(reason);
  }

  // ── handlers ──────────────────────────────────────────────────────────────
  const handleStart = () => {
    if (!videoRef.current) return;
    videoRef.current.play();
    setStarted(true);
    setPause(true);
  };

  const handleVideoPauseAndStart = () => {
    if (!videoRef.current) return;
    if (pause) {
      videoRef.current.pause();
      setPause(false);
    } else {
      if (!started) setStarted(true);
      videoRef.current.play();
      setPause(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    setCurrentTime(current);
    if (videoRef.current.duration) {
      setProgress((current / videoRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    videoRef.current.currentTime =
      (clickX / rect.width) * videoRef.current.duration;
  };

  const handleAddMarker = () => {
    if (!videoRef.current) return;
    setMarkers([...markers, { time: videoRef.current.currentTime }]);
  };

  const handleSeek = () => {
    if (!videoRef.current) return;
    setLastSeekTime(videoRef.current.currentTime);
    const newEvent = {
      time: videoRef.current.currentTime,
      timestamp: Date.now(),
    };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    if (detectRepeatedSeek(updatedEvents)) triggerStuck("repeated_seek");
  };

  const handlePlay = () => {
    setPause(true);
    if (!pauseStart || !lastSeekTime || !videoRef.current) return;
    const pauseDuration = Date.now() - pauseStart;
    const sameSpot = Math.abs(videoRef.current.currentTime - lastSeekTime) < 5;
    if (pauseDuration > 60000 && pauseDuration < 180000 && sameSpot) {
      triggerStuck("seek_pause");
    }
    setPauseStart(null);
  };

  const handleSpeedChange = (speed: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackRate(speed);
    setShowSpeedMenu(false);
  };

  const handleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* ── outer container (also the fullscreen root) ── */}
      <div
        ref={containerRef}
        className="relative w-full max-w-5xl bg-black rounded-xl overflow-hidden shadow-md group"
        style={{ height: isFullscreen ? "100vh" : "350px" }}
        onMouseMove={resetHideTimer}
        onMouseLeave={() => {
          if (isFullscreen && pause)
            hideControlsTimer.current = setTimeout(
              () => setShowControls(false),
              1000,
            );
        }}
      >
        <video
          ref={videoRef}
          src={video}
          onSeeked={handleSeek}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={handlePlay}
          onPause={() => {
            setPause(false);
            setPauseStart(Date.now());
          }}
          onEnded={() => {
            setPause(false);
            setShowTopicEnd(true);
          }}
          onClick={handleVideoPauseAndStart}
          className="w-full h-full object-cover cursor-pointer"
        />

        {/* initial play button */}
        {!started && (
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
        {started && (
          <div
            className={`absolute bottom-0 left-0 right-0 z-30 transition-opacity duration-300 
              ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            {/* gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none rounded-b-xl" />

            <div className="relative px-4 pb-3 pt-8 flex flex-col gap-2">
              {/* progress bar */}
              <div
                ref={progressRef}
                className="w-full h-1.5 bg-white/25 rounded-full cursor-pointer relative group/bar"
                onClick={handleProgressClick}
              >
                {/* fill */}
                <div
                  className="h-full bg-gradient-to-r from-[#359EFF] to-[#5A0BB1] rounded-full relative"
                  style={{ width: `${progress}%` }}
                >
                  {/* thumb */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md scale-0 group-hover/bar:scale-100 transition-transform " />
                </div>
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  {topics!.map((topic, index) => {
                    const percent = (topic.end_time / duration) * 100;

                    return (
                      <div
                        key={index}
                        className="absolute top-0 h-full w-[2px] bg-white/70"
                        style={{ left: `${percent}%` }}
                      />
                    );
                  })}
                </div>

                {/* markers */}
                {markers.map((marker, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 -translate-y-1/2"
                    style={{
                      left: `${(marker.time / (videoRef.current?.duration || 1)) * 100}%`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (videoRef.current)
                        videoRef.current.currentTime = marker.time;
                    }}
                  >
                    <div className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center shadow hover:scale-125 transition cursor-pointer">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#4338ca]/60" />
                    </div>
                  </div>
                ))}
              </div>

              {/* bottom row */}
              <div className="flex items-center gap-3">
                {/* play / pause */}
                <button
                  onClick={handleVideoPauseAndStart}
                  className="w-8 h-8 flex items-center justify-center rounded-lg
                    text-white hover:bg-white/20 transition cursor-pointer"
                >
                  {pause ? <Pause size={18} /> : <Play size={18} />}
                </button>

                {/* time */}
                <span className="text-xs text-white/80 tabular-nums select-none">
                  {formatTime(currentTime)}
                  <span className="text-white/40 mx-1">/</span>
                  {formatTime(duration)}
                </span>

                <div className="bg-gray-500 rounded-full px-2 py-0.5 ml-2">
                  <p className="text-xs text-white/80">{currentTopicName}</p>
                </div>

                {/* spacer */}
                <div className="flex-1" />

                {/* add marker */}
                <button
                  onClick={handleAddMarker}
                  className="flex items-center gap-1.5 text-white/80 hover:text-white
                    text-xs font-medium px-2 py-1 rounded-lg hover:bg-white/15 transition cursor-pointer"
                >
                  <CirclePlus size={15} />
                  <span className="hidden sm:inline">Marker</span>
                </button>

                {/* speed selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowSpeedMenu((p) => !p)}
                    className="flex items-center gap-1.5 text-white/80 hover:text-white
                      text-xs font-medium px-2 py-1 rounded-lg hover:bg-white/15 transition cursor-pointer"
                  >
                    <Gauge size={15} />
                    <span>
                      {playbackRate === 1 ? "Speed" : `${playbackRate}×`}
                    </span>
                  </button>

                  {showSpeedMenu && (
                    <div
                      className="absolute bottom-full right-0 mb-2 bg-[#1a1a2e]/95 border border-white/10
                        rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm min-w-[90px]"
                    >
                      {SPEED_OPTIONS.map((speed) => (
                        <button
                          key={speed}
                          onClick={() => handleSpeedChange(speed)}
                          className={`w-full text-left px-4 py-2 text-xs transition
                            hover:bg-white/10 cursor-pointer
                            ${
                              playbackRate === speed
                                ? "text-[#359EFF] font-semibold"
                                : "text-white/70"
                            }`}
                        >
                          {speed === 1 ? "Normal" : `${speed}×`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* fullscreen */}
                <button
                  onClick={handleFullscreen}
                  className="w-8 h-8 flex items-center justify-center rounded-lg
                    text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
                >
                  {isFullscreen ? (
                    <Minimize size={16} />
                  ) : (
                    <Maximize size={16} />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* stuck popup */}
      {showPopup && (
        <div className="absolute bottom-5 right-5 bg-[#1a1a2e] border border-white/10 text-white p-4 rounded-xl shadow-2xl z-50 max-w-xs">
          <p className="text-sm leading-snug">
            {stuckReason === "repeated_seek"
              ? "Noticed you are seeking a lot, need any help?"
              : stuckReason === "seek_pause"
                ? "Noticed you paused after seeking, need any help?"
                : "Noticed you are spending a lot of time on this topic, need any help?"}{" "}
            👀
          </p>
          <div className="mt-3 flex gap-3 justify-center items-center cursor-pointer">
            <button
              onClick={() => {
                setShowPopup(false); /* open chatbot here */
              }}
              className="bg-gradient-to-r from-[#359EFF] to-[#5A0BB1] text-white text-xs px-3 py-1.5 rounded-lg font-medium"
            >
              Yes Help 😊
            </button>
            <button
              onClick={() => setShowPopup(false)}
              className="text-white/60 hover:text-white text-xs px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              No Thanks 😏
            </button>
          </div>
        </div>
      )}

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
