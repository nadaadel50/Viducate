import { useMutation } from "@tanstack/react-query";
import { uploadVideoUseCase } from "../../../../core/di/upload_video_container";
import { UploadVideoRequest } from "../../domain/entity/upload_video_request";

export function useUploadVideo() {
  const mutation = useMutation({
    mutationFn: async ({
      videoFile,
      title,
      signal,
      onProgress,
      onVideoIdReceived
    }: {
      videoFile: File;
      title: string;
      signal?: AbortSignal;
      onProgress?: (progress: number) => void;
      onVideoIdReceived?: (id: number) => void
    }) => {
      const response = await uploadVideoUseCase.uploadVideo(
        new UploadVideoRequest(
          videoFile,
          videoFile.name,
          title,
          "en",
          "technology",
          videoFile.type,
          videoFile.size
        ),
        onProgress,
        signal,
        onVideoIdReceived

        
        
    
      );

      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data;
    },
  });

  return {
    uploadVideo: mutation.mutate,
    uploadVideoAsync: mutation.mutateAsync,
    data: mutation.data,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
}