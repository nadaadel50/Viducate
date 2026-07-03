import { useState, type ReactNode } from "react";
import { useGetDashboardData } from "../hooks/use_get_dashboard";
import { DashboardContext } from "./dashboard_context";
import type { ContinueLearningEntity } from "../../domain/entity/continue_learning";

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, error } = useGetDashboardData();
  const [uploadedVideos, setUploadedVideos] = useState(false);
  const [linkedVideos, setLinkedVideos] = useState(false);
  const [openDeleteMessage, setOpenDeleteMessage] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<ContinueLearningEntity>();

  const handleUploadedVideosChange = (value: boolean) => {
    setUploadedVideos(value);
  };

  const handleLinkedVideosChange = (value: boolean) => {
    setLinkedVideos(value);
  };
  const handleOpenDeleteMessage = (value: boolean) => {
    setOpenDeleteMessage(value);
  };

  const handleSelectedVideo = (value: ContinueLearningEntity) => {
    setSelectedVideo(value);
  };

  return (
    <DashboardContext.Provider
      value={{
        data: data ?? null,
        isLoading,
        error,
        uploaded_videos: uploadedVideos,
        linked_videos: linkedVideos,
        handleUploadedVideosChange,
        handleLinkedVideosChange,
        openDeleteMessage,
        handleOpenDeleteMessage,
        selectedVideo,
        handleSelectedVideo,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
