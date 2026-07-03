import { useQuery } from "@tanstack/react-query";

import { getUserDataUsecase } from "../../../../core/di/profile_container";

export function useGetUser() {
  const token =
    localStorage.getItem("token") ?? sessionStorage.getItem("token");
  return useQuery({
    queryKey: ["userData"],

    queryFn: async () => {
      const response = await getUserDataUsecase();
      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data;
    },

    enabled: !!token,
  });
}
