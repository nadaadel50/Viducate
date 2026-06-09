import { useQuery } from "@tanstack/react-query";

import { getDashboardData } from "../../../../core/di/dashboard_container";
import { useAuth } from "../../../../core/hooks/useAuth";

export function useGetDashboardData() {
    const {user}=useAuth();
  return useQuery({
    queryKey: ["dashboard-data",user?.id],

queryFn:async () => {
  console.log("came here to get the dashboard data")
    const response=await getDashboardData();
    if(!response.success){
        throw new Error(response.error);
    }
    console.log("dashboard data:",response.data)
     return response.data
},

    enabled: !!user?.id,
  });
}
