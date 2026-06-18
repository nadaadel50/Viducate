import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

type DeleteModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteModal({
  open,
  onClose,
  onConfirm,
}: DeleteModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 20,
            }}
            transition={{ duration: 0.2 }}
            className="w-[90%] max-w-md rounded-3xl border border-white/20 bg-white/70 p-6 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100">
                <AlertTriangle
                  className="text-red-500"
                  size={24}
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Delete Chat
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Are you sure you want to
                  delete this conversation?
                  This action cannot be
                  undone.
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-red-500/20 transition-colors hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}