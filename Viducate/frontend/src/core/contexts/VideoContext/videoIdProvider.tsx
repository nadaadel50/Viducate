// videoIdProvider.tsx
import { useState } from "react";
import { VideoIdContext } from "./videoIdContext";
import type { videoIdContextProps } from "./videoIdContext";

const VIDEO_ID_KEY = "current_video_id";

export const VideoIdProvider = ({ children }: videoIdContextProps) => {
  const [videoId, setVideoIdState] = useState<number | null>(() => {
    const stored = localStorage.getItem(VIDEO_ID_KEY);
    return stored ? Number(stored) : null;
  });

  const setVideoId = (id: number | null) => {
    if (id === null) {
      localStorage.removeItem(VIDEO_ID_KEY);
    } else {
      localStorage.setItem(VIDEO_ID_KEY, String(id));
    }
    setVideoIdState(id);
  };

  return (
    <VideoIdContext.Provider value={{ videoId, setVideoId }}>
      {children}
    </VideoIdContext.Provider>
  );
};