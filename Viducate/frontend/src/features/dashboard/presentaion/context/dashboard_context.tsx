// core/context/DashboardContext.tsx

import { createContext } from "react";
import type { ContinueLearningEntity } from "../../domain/entity/continue_learning";
import type { DashboardUser } from "../../domain/entity/user";
import type { Stats } from "../../domain/entity/stats";



type DashboardData = {
  user: DashboardUser;
  stats: Stats;
  continue_learning: ContinueLearningEntity[];
}

type DashboardContextType = {
  data: DashboardData | null;
  isLoading: boolean;
  error: Error | null;
}

// Context
export const DashboardContext = createContext<DashboardContextType | null>(null);



