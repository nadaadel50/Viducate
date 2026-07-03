import { useCallback, useEffect, useRef } from "react";
import { AlertCircle, Loader2, Video, X } from "lucide-react";
import { UploadBtn } from "../componants/upload/upload_btn";
import { AppRoutesNames } from "../../../../app/routers/routes";
import { useNavigate } from "react-router";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import { useUploadVideo } from "../hooks/use_uploade_video";
import { useDeleteVideo } from "../hooks/use_delete_video";
import { useIntl } from "react-intl";
type UploadLoadingSectionProps = {
  videoFile: File | null;
  title: string;
  progress: number;
  controllerRef: React.RefObject<AbortController | null>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  handleCancel: () => void;
  handleError: (errorMessage: string) => void;
};

export function UploadLoadingSection({
  videoFile,
  title,
  progress,
  controllerRef,
  setProgress,
  handleCancel,
}: UploadLoadingSectionProps) {
  const { setVideoId, videoId } = useLearningSession();
  const { uploadVideo, error } = useUploadVideo();
  const navigate = useNavigate();
  const intl = useIntl();
  const {
    deleteVideoAsync,
    isLoading: isDeleting,
    error: deleteError,
  } = useDeleteVideo();

  const hasStarted = useRef(false);

  useEffect(() => {
    if (!videoFile) return;
    if (hasStarted.current) return;
    hasStarted.current = true;

    const upload = () => {
      controllerRef.current = new AbortController();

      uploadVideo({
        videoFile,
        title,
        signal: controllerRef.current.signal,
        onProgress: (p) => setProgress(p),
        onVideoIdReceived: (id) => setVideoId(id),
      });
    };

    



    upload();

  }, []);

  const handleAnalyze = useCallback(() => {
  
sessionStorage.setItem('from_upload', 'true');
    if (videoId) navigate(AppRoutesNames.processing, { replace: true });
  }, [videoId]);

  const handleCancelClick = async () => {
    controllerRef.current?.abort();
    if (videoId) await deleteVideoAsync(videoId);
    handleCancel();
  };

  return (
    <>
      <div className="bg-gray-50 w-full flex mt-10 py-12 border-2 border-gray-200 rounded-2xl mb-10">
        <div className="w-full p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center justify-center p-3 rounded-xl bg-[#ececf7] text-[#4f46e5]">
            <Video />
          </div>

          <div className="w-full ml-4">
            <div className="flex-1">
              <p className="font-medium">{title}</p>

              <div className="w-full bg-gray-300 h-2 rounded-full mt-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-sm text-gray-500 mt-1">
  {intl.formatMessage({ id: "upload.loading.uploading" })} {progress}%
</p>
            </div>
          </div>

          <button
            onClick={handleCancelClick}
            disabled={isDeleting}
            className="cursor-pointer w-8 h-8 ml-3 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400
              hover:bg-red-50 hover:text-red-500 hover:border-red-200
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-150 shrink-0"
            aria-label={intl.formatMessage({
  id: "upload.loading.cancel",
})}
          >
            {isDeleting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <X size={15} />
            )}
          </button>
        </div>

        {deleteError && (
          <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs">
            <AlertCircle size={14} className="shrink-0" />
            <span>{deleteError}</span>
          </div>
        )}
      </div>

      <UploadBtn
        disabled={progress !== 100}
        label={intl.formatMessage({
  id: "upload.loading.analyze",
})}
        onClick={handleAnalyze}
        error={error}
      />
    </>
  );
}
