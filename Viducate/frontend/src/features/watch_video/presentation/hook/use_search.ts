import { useMutation } from "@tanstack/react-query";
import { getSearchResultsUseCase } from "../../../../core/di/watch_video_container";
import { SemanticSearchRequest } from "../../domin/entity/semantic_search_request";
import type { SearchParams } from "../types/search_parms";

export const useSearchMutation = () => {
  const mutation = useMutation({
    mutationFn: async (searchProps: SearchParams) => {
      const response = await getSearchResultsUseCase.getSearchResults(
        new SemanticSearchRequest(searchProps.query, searchProps.videoId),
      );

      if (!response.success) {
        throw new Error("Search failed");
      }
     

      return response.data;
    },
  });
  return {
    sendQuery: mutation.mutate,
    data: mutation.data,
    isLoadingQuery: mutation.isPending,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
};
