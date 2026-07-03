import { useQuery } from "@tanstack/react-query";

import { getDashboardData } from "../../../../core/di/dashboard_container";
import { useAuth } from "../../../../core/hooks/useAuth";

export function useGetDashboardData() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["dashboard-data", user?.id],

    queryFn: async () => {
      const response = await getDashboardData();

      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data;
    },

    enabled: !!user?.id,
    refetchOnMount: "always",
  });
}
