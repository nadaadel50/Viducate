import { createContext } from "react";

export type VideoIdContextType = {
  videoId: number | null;
  setVideoId : React.Dispatch<React.SetStateAction<number | null>>;
};

export const VideoIdContext = createContext<VideoIdContextType | null>(null);

export type videoIdContextProps = {
  children: React.ReactNode;
};