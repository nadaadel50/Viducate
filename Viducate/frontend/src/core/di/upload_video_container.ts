import { UploadVideoService } from "../../features/video_upload/api/client/upload_video_service";
import { UploadVideoDataSourceImp } from "../../features/video_upload/api/data_source/upload_video_dataSource_imp";
import { uploadVideoRepoImp } from "../../features/video_upload/data/repository/upload_video_repo_imp";
import { DeleteVideoUseCase } from "../../features/video_upload/domain/usecase/delete_video_usecase";
import { UploadUrlUseCase } from "../../features/video_upload/domain/usecase/upload_url_usecase";
import { UploadVideoUseCase } from "../../features/video_upload/domain/usecase/upload_video_usecase";

const uploadService = new UploadVideoService();
const dataSource = new UploadVideoDataSourceImp(uploadService);
const repository = new uploadVideoRepoImp(dataSource);

export const uploadVideoUseCase = new UploadVideoUseCase(repository);
export const deleteVideoUseCase = new DeleteVideoUseCase(repository);
export const uploadURLUseCase = new UploadUrlUseCase(repository);
