import { useQuery } from "@tanstack/react-query";

import { getUserDataUsecase } from "../../../../core/di/profile_container";

export function useGetUserData() {
  return useQuery({
    queryKey: ["user-data"],

    queryFn: async () => {
      const response = await getUserDataUsecase();
      if (!response.success) {
        throw new Error(response.error);
    }
  
     return response.data
},

    enabled: true,
  });
}
