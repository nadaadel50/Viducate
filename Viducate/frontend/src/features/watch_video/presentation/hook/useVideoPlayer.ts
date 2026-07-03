import { useRef } from "react";

export function useVideoPlayer() {
  const playerRef = useRef<HTMLVideoElement | null>(null);

  const seek = (time: number) => {
    
    if (playerRef.current){
    
     
      playerRef.current.currentTime = time;}
     
       
  };
  const play = () => playerRef.current?.play();
  const pause = () => playerRef.current?.pause();

  const getCurrentTime = () => playerRef.current?.currentTime ?? 0;
  const getDuration = () => playerRef.current?.duration ?? 0;

  const setSpeed = (rate: number) => {
    if (playerRef.current) playerRef.current.playbackRate = rate;
  };

  return {
    play,
    pause,
    playerRef,
    seek,
    getCurrentTime,
    getDuration,
    setSpeed,
  };
}
