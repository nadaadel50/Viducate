import { useQuery } from "@tanstack/react-query";
import { getPreferencesUseCase } from "../../../../core/di/pref_container";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";

export const useGetPreferences = () => {
  const { videoId } = useLearningSession();
  return useQuery({
    queryKey: ["preferences", videoId],
    queryFn: async () => {
      const response = await getPreferencesUseCase.execute(videoId!);
      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data;
    },

    enabled: !!videoId,
  });
};
