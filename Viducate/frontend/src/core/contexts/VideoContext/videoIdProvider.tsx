import { useState } from "react";
import { VideoIdContext } from "./videoIdContext";
import type { videoIdContextProps } from "./videoIdContext";

export const VideoIdProvider = ({ children }: videoIdContextProps) => {
  const [videoId, setVideoId ] = useState<number | null>(null);

  return (
    <VideoIdContext.Provider value={{ videoId, setVideoId  }}>
      {children}
    </VideoIdContext.Provider>
  );
};