import { useContext } from "react";
import { VideoIdContext } from "../contexts/VideoContext/videoIdContext";
export const useVideoId = () => {
  const context = useContext(VideoIdContext);
  if (!context) {
    throw new Error("useVideoId must be used within VideoIdProvider");
  }
  return context;
};
