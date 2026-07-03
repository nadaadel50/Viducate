import { useQuery } from "@tanstack/react-query";
import type { MindMapReq } from "../../domain/entity/maind_map_req";
import { getMindMapDetails } from "../../../../core/di/mind_map_container";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";

export function useGetMindMap() {
  const { videoId } = useLearningSession();
  return useQuery({
    queryKey: ["mind_map", videoId],

    queryFn: async () => {
      const req: MindMapReq = {
        videoid: videoId!,
      };
      const response = await getMindMapDetails(req);
      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data;
    },

    enabled: !!videoId,
  });
}
