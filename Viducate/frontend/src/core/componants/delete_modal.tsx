import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";
import { FONT_SIZE, FONT_WEIGHT, LINE_HEIGHT } from "../constants/fonts_update";


type DeleteModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteModal({
  open,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
  onClose,
  onConfirm,
}: DeleteModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto w-full max-w-xs overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl sm:max-w-sm"
            >
              <div className="p-5 text-center">
                {/* Icon */}
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500 shadow-sm">
                  <AlertTriangle size={22} />
                </div>

                {/* Title */}
                <h3
                  className={`
                    ${FONT_SIZE.size18}
                    ${FONT_WEIGHT.bold}
                    text-slate-900
                    mb-2
                  `}
                >
                  {title}
                </h3>

                {/* Description */}
                <p
                  className={`
                    ${FONT_SIZE.size14}
                    ${LINE_HEIGHT.relaxed}
                    text-slate-500
                    mb-5
                  `}
                >
                  {description}
                </p>

                {/* Actions */}
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className={`
                      ${FONT_SIZE.size14}
                      ${FONT_WEIGHT.semibold}
                      rounded-lg
                      px-4
                      py-2
                      text-slate-600
                      transition-colors
                      hover:bg-slate-100
                      disabled:opacity-70
                    `}
                  >
                    {cancelText}
                  </button>

                  <button
                    type="button"
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={`
                      ${FONT_SIZE.size14}
                      ${FONT_WEIGHT.semibold}
                      flex items-center justify-center gap-2
                      rounded-lg
                      bg-red-500
                      px-4
                      py-2
                      text-white
                      shadow-md shadow-red-500/20
                      transition-all
                      hover:bg-red-600
                      active:scale-95
                      disabled:cursor-not-allowed
                      disabled:opacity-70
                    `}
                  >
                    {isLoading ? (
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      confirmText
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