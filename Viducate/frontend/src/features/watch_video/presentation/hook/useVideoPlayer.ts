import type { RefObject } from "react";

export function useVideoPlayer(videoRef: RefObject<HTMLVideoElement | null>) {
  const play = () => {
    if (!videoRef.current) return;
    videoRef.current.play();
  };

  const pause = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
  };

  const seek = (time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
  };

  const getCurrentTime = () => {
    if (!videoRef.current) return 0;
    return videoRef.current.currentTime;
  };

  const setSpeed = (speed: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
  };

  const getDuration = () => {
    if (!videoRef.current) return 0;
    return videoRef.current.duration;
  };

  return {
    play,
    pause,
    seek,
    getCurrentTime,
    setSpeed,
    getDuration,
  };
}