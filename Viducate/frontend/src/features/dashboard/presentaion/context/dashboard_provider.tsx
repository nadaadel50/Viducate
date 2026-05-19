import { useState, type ReactNode } from "react";
import { useGetDashboardData } from "../hooks/use_get_dashboard";
import { DashboardContext } from "./dashboard_context";

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, error } = useGetDashboardData();
  const [uploadedVideos, setUploadedVideos] = useState(false);
  const [linkedVideos, setLinkedVideos] = useState(false);

  const handleUploadedVideosChange = (value: boolean) => {
    setUploadedVideos(value);
  };

  const handleLinkedVideosChange = (value: boolean) => {
    setLinkedVideos(value);
  };

  return (
    <DashboardContext.Provider value={{ data: data ?? null, isLoading, error, uploaded_videos: uploadedVideos, linked_videos: linkedVideos, handleUploadedVideosChange, handleLinkedVideosChange }}>
      {children}
    </DashboardContext.Provider>
  );
}