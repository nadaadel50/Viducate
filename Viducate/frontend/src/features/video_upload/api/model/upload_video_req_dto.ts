import type { UploadVideoRequest } from "../../domain/entity/upload_video_request";


export type UploadVideoRequestDTO = {
  filename: string;
  title: string;
  language: string;
  subject: string;
  content_type: string;
};

export function uploadFilestoFormData(req: UploadVideoRequest) {
  const formData = new FormData();

  formData.append("file", req.file);
  formData.append("filename", req.filename);
  formData.append("title", req.title);
  formData.append("language", req.language);
  formData.append("subject", req.subject);
  formData.append("content_type", req.content_type);

  return formData;
}