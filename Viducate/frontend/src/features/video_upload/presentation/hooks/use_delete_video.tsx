import { useMutation } from "@tanstack/react-query";
import { deleteVideoUseCase } from "../../../../core/di/upload_video_container";

export function useDeleteVideo() {
  const mutation = useMutation({
    mutationFn: async (videoId: number) => {
      const response = await deleteVideoUseCase.deleteVideo(videoId);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
  });

  return {
    deleteVideoAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error?.message ?? null,
  };
}