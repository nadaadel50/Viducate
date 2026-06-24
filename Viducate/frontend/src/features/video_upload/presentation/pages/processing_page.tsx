import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  XCircle,
  CheckCircle,
  X,
  RotateCcw,
} from "lucide-react";
import { FormattedMessage } from "react-intl";
import { AnalysisStepItem } from "../componants/analysis_step_item";
import { TipCard } from "../componants/tip_card";
import { COLORS } from "../../../../core/constants/colors";
import { useProcessingStatus } from "../hooks/use_processing_status";
import { AppRoutesNames } from "../../../../app/routers/routes";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import { useCancelAnalysis } from "../hooks/use_cancel_analysis";
import { CancelAnalysisModal } from "../componants/cancel_analysis_modal";
import MainText from "../../../../core/componants/text_section";

export function ProcessingPage() {
  const { videoId } = useLearningSession();
  const navigate = useNavigate();

  const [isCancelModalOpen, setIsCancelModalOpen] =
    useState(false);

  const { status, progress } =
    useProcessingStatus(videoId!);

  const { cancel, isLoading: isCancelling } =
    useCancelAnalysis();

  useEffect(() => {
    if (status === "completed") {
      const timeout = setTimeout(
        () =>
          navigate(AppRoutesNames.wathcVideo, {
            replace: true,
          }),
        2500
      );

      return () => clearTimeout(timeout);
    }
  }, [status, navigate, videoId]);

  const ringGradient = useMemo(
    () => ({
      background:
        status === "failed"
          ? `conic-gradient(from 0deg, ${COLORS.state.error} 0%, ${COLORS.state.error} 100%)`
          : status === "completed"
          ? `conic-gradient(from 0deg, ${COLORS.state.success} 0%, ${COLORS.state.success} 100%)`
          : `conic-gradient(from 0deg, ${COLORS.brand.primary} 0%, ${COLORS.brand.secondary} ${progress}%, ${COLORS.effects.ringEmpty} ${progress}%)`,
    }),
    [progress, status]
  );

  const handleCancelConfirm = () => {
    cancel(videoId!, () => {
      navigate("/UploadVideoPage", {
        replace: true,
      });
    });
  };

  return (
    <div
      className="relative min-h-screen font-display flex flex-col items-center justify-center bg-white overflow-hidden px-4 py-4 "
      style={{
        backgroundColor: "#fff",
        backgroundImage: COLORS.background.radialGradient,
      }}
    >
      <div className="relative z-10 w-full max-w-[520px] flex flex-col items-center gap-5 md:gap-7">
        {/* Progress Section */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-indigo-100/30 rounded-full blur-3xl scale-150 animate-pulse" />

          <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full p-3 bg-white shadow-xl flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full opacity-20 transition-all duration-500"
              style={ringGradient}
            />

            <div className="flex flex-col items-center text-center">
              {status === "failed" ? (
                <XCircle
                  size={40}
                  className="md:w-12 md:h-12 text-red-500 animate-in zoom-in duration-500"
                />
              ) : status === "completed" ? (
                <CheckCircle
                  size={40}
                  className="md:w-12 md:h-12 text-green-500 animate-in zoom-in duration-500"
                />
              ) : (
                <span
                  className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter"
                  style={{
                    color: COLORS.brand.primary,
                  }}
                >
                  {progress}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center space-y-1.5">
            <MainText bigTitle={<FormattedMessage
              id={
                status === "failed"
                  ? "analysis.error.title"
                  : status === "completed"
                  ? "analysis.complete"
                  : "analysis.title"
              }
            />} smallTitle={ <FormattedMessage
              id={
                status === "failed"
                  ? "analysis.error.subtitle"
                  : status === "completed"
                  ? "analysis.ready"
                  : "analysis.subtitle"
              }
            />}/>
          
        </div>
      

        {/* Steps Timeline */}
        <div className="w-full max-w-sm bg-white/60 backdrop-blur-md rounded-xl p-4  border border-white/60 shadow-sm shadow-indigo-100/20">
          <AnalysisStepItem
            labelId="analysis.step.fetching"
            status={
              status === "failed"
                ? "failed"
                : status !== "segmenting" &&
                  status !== "completed"
                ? "active"
                : "completed"
            }
          />

          <AnalysisStepItem
            labelId="analysis.step.segmenting"
            status={
              status === "failed"
                ? "failed"
                : status === "segmenting"
                ? "active"
                : status === "completed"
                ? "completed"
                : "pending"
            }
            isLast
          />
        </div>

        <TipCard />

        {/* Actions Area */}
        <div className="flex flex-col items-center gap-3 md:gap-4 w-full pb-4 md:pb-6">
          {status === "failed" ? (
            <button
              onClick={() =>
                navigate("/UploadVideoPage", {
                  replace: true,
                })
              }
              className="flex items-center gap-2 px-4 md:px-6 py-2 rounded-full text-sm font-semibold text-white transition-all active:scale-95 shadow-lg shadow-indigo-200/50 group"
              style={{
                backgroundColor: COLORS.brand.primary,
              }}
            >
              <RotateCcw
                size={18}
                className="group-hover:rotate-[-180deg] transition-transform"
              />

              <FormattedMessage id="analysis.retry" />
            </button>
          ) : (
            status !== "completed" && (
              <button
                onClick={() =>
                  setIsCancelModalOpen(true)
                }
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all hover:text-red-500 cursor-pointer active:scale-95"
                style={{
                  color: COLORS.text.muted,
                }}
              >
                <X size={12} />
                <FormattedMessage id="analysis.cancel" />
              </button>
            )
          )}
        </div>
      </div>

      <CancelAnalysisModal
        isOpen={isCancelModalOpen}
        isLoading={isCancelling}
        onConfirm={handleCancelConfirm}
        onCancel={() =>
          setIsCancelModalOpen(false)
        }
      />
    </div>
  );
}