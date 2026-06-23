import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto w-full max-w-md overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl"
            >
              <div className="p-8 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-8 border-white bg-red-50 text-red-500 shadow-sm">
                  <AlertTriangle size={32} />
                </div>

                <h3 className="mb-3 text-2xl font-bold text-slate-900">
                  {title}
                </h3>

                <p className="mb-10 text-sm leading-relaxed text-slate-500">
                  {description}
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="rounded-xl px-8 py-3 font-bold text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-70"
                  >
                    {cancelText}
                  </button>

                  <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-8 py-3 font-bold text-white shadow-md shadow-red-500/20 transition-all hover:bg-red-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLoading ? (
                      <Loader2
                        size={18}
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