import { useQuery } from "@tanstack/react-query";

import { getDashboardData } from "../../../../core/di/dashboard_container";
import { useAuth } from "../../../../core/hooks/useAuth";

export function useGetDashboardData() {
    const {user}=useAuth();
    console.log("the user from dashboard is:",user?.id)
  return useQuery({
    queryKey: ["dashboard-data",user?.id],

queryFn:async () => {
  console.log("came here to get the dashboard data")
    const response=await getDashboardData();
    console.log("came here to see")
    if(!response.success){
        throw new Error(response.error);
    }
    console.log("dashboard data:",response.data)
     return response.data
},

    enabled: !!user?.id,
    refetchOnMount: "always"
  });
}
