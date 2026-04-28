import { createContext } from "react";

export type VideoIdContextType = {
  videoId: number | null;
  setVideoId: (id: number | null) => void; 
};

export const VideoIdContext = createContext<VideoIdContextType | null>(null);

export type videoIdContextProps = {
  children: React.ReactNode;
};