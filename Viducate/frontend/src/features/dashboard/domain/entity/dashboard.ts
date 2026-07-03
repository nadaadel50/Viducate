import type { ContinueLearningEntity } from "./continue_learning";
import type { Stats } from "./stats";
import type { DashboardUser } from "./user";

export type DashboardEntity = {
  user: DashboardUser;
  stats: Stats;
  continue_learning: ContinueLearningEntity[];
};
