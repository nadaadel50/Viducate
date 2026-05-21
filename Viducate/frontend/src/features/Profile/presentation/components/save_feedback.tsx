import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Save } from 'lucide-react';

interface SaveFeedbackProps {
  type: 'success' | 'error' | '';
  text: string;
}

export function SaveFeedback({ type, text }: SaveFeedbackProps) {
  return (
    <div className="text-sm w-full sm:w-auto h-6 sm:mr-auto flex items-center justify-center sm:justify-start">
      <AnimatePresence mode="wait">
        {text && (
          <motion.span
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex items-center gap-2 font-semibold ${
              type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {type === 'error' ? <AlertTriangle size={16} /> : <Save size={16} />}
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
