import { useEffect, useRef, useState } from "react";
import { CirclePlus, Pause, Play } from "lucide-react";
import video from "../../../../assets/videos/test.mp4";
import { TopicEndSection } from "../sections/topic_end_section";
import { useSelectedTopic } from "../context/topic_context";
import { PopupOnTimeline } from "./popup_on_time_line";
import { PopupBottomRight } from "./popup_bottom";

export function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [started, setStarted] = useState(false);
  const [prgress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [pause, setPause] = useState(false);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [showTopicEnd, setShowTopicEnd] = useState(false);
  const { selectedTopic } = useSelectedTopic();
  const [events, setEvents] = useState<{ time: number; timestamp: number }[]>(
    [],
  );
  const { setCurrentTime: setTime, changeProgressValue } = useSelectedTopic();
  const [lastSeekTime, setLastSeekTime] = useState<number | null>(null);
  const [pauseStart, setPauseStart] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [lastPopupTime, setLastPopupTime] = useState(0);
  const [topicStartTime, setTopicStartTime] = useState<number | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [topicDuration, setTopicDuration] = useState(0);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  type Marker = {
    time: number;
  };

  useEffect(() => {
    if (selectedTopic && videoRef.current) {
      setTopicStartTime(Date.now());
      setTopicDuration(
        (selectedTopic.end_time - selectedTopic.start_time) * 1000,
      );
      setTimeSpent(0);
      if (changeProgressValue) {
        videoRef.current.currentTime = selectedTopic.start_time;
        setCurrentTime(selectedTopic.start_time);
        setProgress(
          (selectedTopic.start_time / videoRef.current.duration) * 100,
        );
      }
    }

    setEvents([]);
  }, [selectedTopic]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);




  function detectRepeatedSeek(events: { time: number; timestamp: number }[]) {
    const now = Date.now();

    const lastMinute = events.filter((e) => now - e.timestamp < 60000);
    const clusters: number[][] = [];

    for (const event of lastMinute) {
      const existingCluster = clusters.find((cluster) =>
        cluster.some((time) => Math.abs(time - event.time) < 5),
      );

      if (existingCluster) {
        existingCluster.push(event.time);
      } else {
        clusters.push([event.time]);
      }
    }

    return clusters.some((cluster) => cluster.length >= 3);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (topicStartTime && pause) {
        setTimeSpent((prev) => prev + 1000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [topicStartTime, pause]);

  useEffect(() => {
    if (topicDuration && timeSpent > topicDuration * 2) {
      triggerStuck("user spending too much time on topic");
    }
  }, [timeSpent, topicDuration]);

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
    setTime(videoRef.current.currentTime);

    const current = videoRef.current.currentTime;
    setCurrentTime(current);

    const duration = videoRef.current.duration;
    if (duration) {
      setProgress((current / duration) * 100);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

    const newTime = (clickX / rect.width) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
  };

  const handleAddMarker = () => {
    if (!videoRef.current) return;

    const time = videoRef.current.currentTime;
    setMarkers([...markers, { time }]);
  };

  function triggerStuck(reason: string) {
    if (Date.now() - lastPopupTime < 120000) return;

    setShowPopup(true);
    setLastPopupTime(Date.now());

    console.log("User might be stuck due to:", reason);
  }

  const handleSeek = () => {
    if (!videoRef.current) return;
    setLastSeekTime(videoRef.current.currentTime);

    const current = videoRef.current.currentTime;

    const newEvent = {
      time: current,
      timestamp: Date.now(),
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);

    if (detectRepeatedSeek(updatedEvents)) {
      triggerStuck("repeated_seek");
    }
  };

  const handlePlay = () => {
    setPause(true);
    if (!pauseStart || !lastSeekTime || !videoRef.current) return;

    const pauseDuration = Date.now() - pauseStart;
    const current = videoRef.current.currentTime;

    const sameSpot = Math.abs(current - lastSeekTime) < 5;

    // between min and 3 min

    if (pauseDuration > 60000 && pauseDuration < 180000 && sameSpot) {
      triggerStuck("seek_pause");
    }

    setPauseStart(null);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* video */}
      <div className="relative w-full max-w-5xl h-[350px]">
        <video
          ref={videoRef}
          src={video}
          controls={started}
          onSeeked={handleSeek}
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlay}
          onPause={() => {
            setPause(false);
            setPauseStart(Date.now());
          }}
          onEnded={() => {
            setPause(false);
            setShowTopicEnd(true);
          }}
          className="w-full h-full object-cover rounded-xl shadow-md border border-transparent hover:border-[#4f46e5]/30 transition"
        />



        {/* overlay */}
        <div
          className={`fixed inset-0 flex items-center justify-center z-20 
          bg-black/60 transition-all duration-500
          ${
            showTopicEnd
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20 pointer-events-none"
          }`}
        >
          <TopicEndSection />
        </div>

        {/* play button */}
        {!started && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={handleStart}
              className="cursor-pointer bg-gradient-to-br from-[#359EFF]/60 to-[#5A0BB1]/60
              hover:from-[#5A0BB1] hover:to-[#359EFF]
              text-white p-5 rounded-full transition"
            >
              <Play className="w-8 h-8" />
            </button>
          </div>
        )}
      </div>
      {/* 
      {showPopup && (
        <div className="fixed bottom-5 right-5 bg-black text-white p-4 rounded-xl shadow-lg z-50">
          👀 شكلك بتعيد الجزء ده كتير
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => {
                setShowPopup(false);
                alert("هنساعدك هنا بعدين 😄"); // placeholder
              }}
              className="bg-white text-black px-2 py-1 rounded"
            >
              ساعدني
            </button>

            <button onClick={() => setShowPopup(false)} className="px-2 py-1">
              لا شكراً
            </button>
          </div>
        </div>
      )} */}
      {showPopup && !isFullscreen && (
  <PopupBottomRight onClose={() => setShowPopup(false)} />
)}

      {/* controls */}
      <div className="w-full max-w-5xl flex gap-3 mt-5 items-center rounded-xl border border-slate-100 bg-white p-4 shadow-md">
        {/* play / pause */}
        <span
          onClick={handleVideoPauseAndStart}
          className="cursor-pointer w-10 h-10 flex justify-center items-center rounded-xl bg-slate-50 hover:bg-[#4338ca] hover:text-white text-slate-700 transition"
        >
          {!pause ? <Play size={20} /> : <Pause size={20} />}
        </span>

        {/* progress */}
        <div
          ref={progressRef}
          className="flex-1 h-2 bg-slate-200 rounded-full cursor-pointer relative"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-gradient-to-r from-[#359EFF] to-[#5A0BB1] rounded-full"
            style={{ width: `${prgress}%` }}
          />

          {showPopup && isFullscreen && videoRef.current && (
            <PopupOnTimeline
              currentTime={currentTime}
              duration={videoRef.current.duration}
              onClose={() => setShowPopup(false)}
            />
          )}

          {markers.map((marker, index) => (
            <div
              key={index}
              className="absolute top-1/2 -translate-y-1/2 cursor-pointer"
              style={{
                left: `${(marker.time / videoRef.current!.duration) * 100}%`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                videoRef.current!.currentTime = marker.time;
              }}
            >
              <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center shadow hover:scale-110 transition">
                <div className="w-2 h-2 rounded-full bg-[#4338ca]/50"></div>
              </div>
            </div>
          ))}
        </div>

        {/* time */}
        <div className="text-sm text-slate-500 min-w-[50px] text-center">
          {Math.floor(currentTime / 60)}:
          {String(Math.floor(currentTime % 60)).padStart(2, "0")}
        </div>

        {/* add marker */}
        <div
          onClick={handleAddMarker}
          className="flex gap-2 items-center text-[#4338ca] text-sm font-medium px-2 py-1 rounded hover:bg-[#4338ca]/5 cursor-pointer"
        >
          <CirclePlus size={18} />
          Add Marker
        </div>
      </div>
    </div>
  );
}
