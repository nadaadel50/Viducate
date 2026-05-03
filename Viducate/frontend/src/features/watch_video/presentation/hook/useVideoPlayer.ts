// import type { RefObject } from "react";

// export function useVideoPlayer(videoRef: RefObject<HTMLVideoElement | null>) {
//   const play = () => {
//     if (!videoRef.current) return;
//     videoRef.current.play();
//   };

//   const pause = () => {
//     if (!videoRef.current) return;
//     videoRef.current.pause();
//   };

//   const seek = (time: number) => {
//     if (!videoRef.current) return;
//     videoRef.current.currentTime = time;
//   };

//   const getCurrentTime = () => {
//     if (!videoRef.current) return 0;
//     return videoRef.current.currentTime;
//   };

//   const setSpeed = (speed: number) => {
//     if (!videoRef.current) return;
//     videoRef.current.playbackRate = speed;
//   };

//   const getDuration = () => {
//     if (!videoRef.current) return 0;
//     return videoRef.current.duration;
//   };

//   return {
//     play,
//     pause,
//     seek,
//     getCurrentTime,
//     setSpeed,
//     getDuration,
//   };
// }

// import { useRef, useCallback } from "react";

// export function useVideoPlayer() {
//   const playerRef = useRef<HTMLVideoElement | null>(null);

//   const play = useCallback(() => {
//     playerRef.current?.play();
//   }, []);

//   const pause = useCallback(() => {
//     playerRef.current?.pause();
//   }, []);

//   const seek = useCallback((time: number) => {
//     if (playerRef.current) playerRef.current.currentTime = time;
//   }, []);

//   const getCurrentTime = useCallback(() => {
//     return playerRef.current?.currentTime ?? 0;
//   }, []);

//   const getDuration = useCallback(() => {
//     return playerRef.current?.duration ?? 0;
//   }, []);

//   const setSpeed = useCallback((rate: number) => {
//     if (playerRef.current) playerRef.current.playbackRate = rate;
//   }, []);

//   return {
//     playerRef,
//     play,
//     pause,
//     seek,
//     getCurrentTime,
//     getDuration,
//     setSpeed,
//   };
// }

import { useRef } from "react";

export function useVideoPlayer() {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  
  const seek = (time: number) => {
    if (playerRef.current) playerRef.current.currentTime = time;
  };

  const getCurrentTime = () => playerRef.current?.currentTime ?? 0;
  const getDuration = () => playerRef.current?.duration ?? 0;
  
  const setSpeed = (rate: number) => {
    if (playerRef.current) playerRef.current.playbackRate = rate;
  };

  return { playerRef, seek, getCurrentTime, getDuration, setSpeed };
}