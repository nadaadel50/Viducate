import { motion, AnimatePresence } from "framer-motion";
import { Info, Loader2 } from "lucide-react";
import { COLORS } from "../../../../core/constants";

interface ExistingVideoModalProps {
  show: boolean;
  isLoading?: boolean;
  onOpenVideo: () => void;
  onCancel: () => void;
}

export function ExistingVideoModal({
  show,
  isLoading = false,
  onOpenVideo,
  onCancel,
}: ExistingVideoModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            onClick={onCancel}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto border border-slate-100"
            >
              <div className="p-8 sm:p-10 text-center">
                <div className="w-20 h-20 rounded-full bg-indigo-50 border-8 border-white shadow-sm flex items-center justify-center text-[#4f46e5] mx-auto mb-6">
                  <Info size={32} />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  Video Already Exists
                </h3>

                <p className="text-slate-500 text-sm mb-10 leading-relaxed px-2">
                  This video has already been processed and is available in your
                  dashboard.
                  <br />
                  <br />
                  Would you like to open the existing video version?
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <button
                    onClick={onCancel}
                    disabled={isLoading}
                    className="cursor-pointer w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={onOpenVideo}
                    disabled={isLoading}
                    style={{
                      background:
                       COLORS.button.primary
                    }}
                    className="cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2   text-white px-8 py-3.5 rounded-xl font-bold shadow-md shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
                  
                  >
                    {isLoading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      "Open Video"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
