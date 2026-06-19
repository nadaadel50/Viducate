import { useMutation } from "@tanstack/react-query";
import { uploadURLUseCase } from "../../../../core/di/upload_video_container";
import { UrlRequest } from "../../domain/entity/url_request";

export function useUploadLink() {
  const mutation = useMutation({
    mutationFn: async ({
      url,
      title,
      language,
      subject
    }: {
      url: string;
      title: string;
      language: string;
      subject: string;
    }) => {
      const response = await uploadURLUseCase.uploadUrl(
        new UrlRequest(url, title, language,subject),
      );

      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data;
    },
  });

  return {
    uploadLink: mutation.mutate,
    uploadLinkAsync: mutation.mutateAsync,
    data: mutation.data,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
}