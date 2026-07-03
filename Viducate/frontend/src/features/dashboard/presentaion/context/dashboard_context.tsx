import { createContext } from "react";
import type { ContinueLearningEntity } from "../../domain/entity/continue_learning";
import type { DashboardUser } from "../../domain/entity/user";
import type { Stats } from "../../domain/entity/stats";

type DashboardData = {
  user: DashboardUser;
  stats: Stats;
  continue_learning: ContinueLearningEntity[];
};

type DashboardContextType = {
  data: DashboardData | null;
  isLoading: boolean;
  error: Error | null;
  uploaded_videos: boolean;
  linked_videos: boolean;
  handleUploadedVideosChange: (value: boolean) => void;
  handleLinkedVideosChange: (value: boolean) => void;
  openDeleteMessage: boolean;
  handleOpenDeleteMessage: (value: boolean) => void;
  selectedVideo: ContinueLearningEntity | undefined;
  handleSelectedVideo: (value: ContinueLearningEntity) => void;
};

export const DashboardContext = createContext<DashboardContextType | null>(
  null,
);
