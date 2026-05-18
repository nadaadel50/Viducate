import type { ReactNode } from "react";
import { useGetDashboardData } from "../hooks/use_get_dashboard";
import { DashboardContext } from "./dashboard_context";

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, error } = useGetDashboardData();

  return (
    <DashboardContext.Provider value={{ data: data ?? null, isLoading, error }}>
      {children}
    </DashboardContext.Provider>
  );
}