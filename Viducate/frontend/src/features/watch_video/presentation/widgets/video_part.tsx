import { useRef, useState } from "react";
import { CirclePlus, Gauge, Pause, Play } from "lucide-react";
import video from "../../../../assets/videos/test.mp4";

export function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [started, setStarted] = useState(false);
  const [prgress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [pause, setPause] = useState(false);
  const progressRef = useRef<HTMLDivElement | null>(null);

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
    <div className="flex flex-col">
      <div className="relative w-250 h-[400px] transition ">
        <video
          ref={videoRef}
          src={video}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => {
            setPause(false);
          }}
          className="w-250 h-full object-cover rounded-xl hover:scale-[1.01] shadow-glow border border-3 border-transparent hover:border-[#4f46e5]/30 transition-all"
        />

        {!started && (
          <div className="absolute inset-0 flex items-center justify-center ">
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


        <div className="absolute bottom-2 right-2 w-10 h-10 bg-blue-100 flex ">
          <button><Gauge /></button>
          <button></button>

        </div>
      </div>

      <div className="w-full bg-green-100 flex gap-2 mt-5 justify-center items-center  rounded-2xl border border-slate-100  bg-white  p-6 shadow-xl shadow-slate-200/50 ">
        {/* icon */}
        <span
          onClick={handleVideoPauseAndStart}
          className="  cursor-pointer w-10 h-10 bg-blue-300 flex justify-center items-center rounded-xl bg-slate-50 hover:bg-[#4338ca] hover:text-white text-slate-700  transition-all duration-300 shadow-sm"
        >
          {!pause ? <Play size={24} /> : <Pause size={24} />}
        </span>
        {/* progress */}
        <div
          ref={progressRef}
          className="w-180 h-2 bg-slate-200 rounded-full mt-2 cursor-pointer relative shadow-inner"
          onClick={handleProgressClick}
        >
          <div
            className=" h-full bg-gradient-to-br from-[#359EFF] to-[#5A0BB1] rounded-full transition-all"
            style={{ width: `${prgress}%` }}
          />

          {markers.map((marker, index) => (
            <div
              key={index}
              className="absolute absolute top-1/2 -translate-y-1/2  cursor-pointer "
              onClick={(e) => {
                e.stopPropagation();

                videoRef.current!.currentTime = marker.time;
              }}
              style={{
                left: `${(marker.time / videoRef.current!.duration) * 100}%`,
              }}
            >
              <div className="w-5 h-5 rounded-full shadow-md bg-white flex justify-center items-center hover:scale-125 transition-transform z-10  hover:shadow-md hover:shadow-[#4338ca]/50">
                <div className="w-3 h-3 rounded-full bg-[#4338ca]/40"></div>
              </div>
            </div>
          ))}
        </div>

        {/* time */}
        <div className="text-sm text-slate-500">
          {Math.floor(currentTime / 60)}:
          {String(Math.floor(currentTime % 60)).padStart(2, "0")}
        </div>

        <p className="text-slate-200">|</p>

        {/* add marker */}
        <div
          onClick={handleAddMarker}
          className="flex gap-2 bg-white  justify-center items-center font-bold uppercase tracking-wider text-[#4338ca] transition-colors px-2 py-1 rounded hover:bg-[#4338ca]/5 cursor-pointer "
        >
          <CirclePlus size={20} />
          <p className="text-sm">ADD Marker</p>
        </div>
      </div>
    </div>
  );
}
