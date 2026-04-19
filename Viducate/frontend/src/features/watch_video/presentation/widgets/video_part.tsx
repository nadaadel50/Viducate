import { useRef, useState } from "react";
import { CirclePlus, Pause, Play } from "lucide-react";
import video from "../../../../assets/videos/test.mp4";
import { TopicEndSection } from "../sections/topic_end_section";

export function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [started, setStarted] = useState(false);
  const [prgress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [pause, setPause] = useState(false);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [showTopicEnd, setShowTopicEnd] = useState(false);

  type Marker = {
    time: number;
  };
  const [markers, setMarkers] = useState<Marker[]>([]);

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

  return (
    <div className="flex flex-col items-center w-full">

      {/* video */}
      <div className="relative w-full max-w-5xl h-[350px]">
        <video
          ref={videoRef}
          src={video}
          controls={started}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setPause(true)}
          onPause={() => setPause(false)}
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