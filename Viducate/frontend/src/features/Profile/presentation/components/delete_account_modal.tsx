import { motion, AnimatePresence } from'framer-motion';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

interface DeleteAccountModalProps {
  show: boolean;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteAccountModal({ show, isDeleting, onConfirm, onCancel }: DeleteAccountModalProps) {
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
                <div className="w-20 h-20 rounded-full bg-red-50 border-8 border-white shadow-sm flex items-center justify-center text-[#e11d48] mx-auto mb-6">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-900 mb-3">
                  <FormattedMessage id="profile.deleteModal.title" defaultMessage="Delete Account" />
                </h3>
                <p className="text-slate-500 text-sm mb-10 leading-relaxed px-2">
                  <FormattedMessage
                    id="profile.deleteModal.description"
                    defaultMessage="Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone."
                  />
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <button
                    onClick={onCancel}
                    disabled={isDeleting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <FormattedMessage id="common.cancel" defaultMessage="Cancel" />
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={isDeleting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#e11d48] hover:bg-red-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-md shadow-red-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isDeleting
                      ? <Loader2 size={18} className="animate-spin" />
                      : <FormattedMessage id="profile.deleteModal.confirm" defaultMessage="Delete Account" />
                    }
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
