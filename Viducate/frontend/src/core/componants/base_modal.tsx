import React from 'react';
import type { ReactNode } from 'react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}

export const BaseModal: React.FC<BaseModalProps> = ({ isOpen, onClose, children, maxWidth = "max-w-5xl" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
    
      <div className={`relative w-full ${maxWidth} max-h-[90vh] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl ring-1 ring-gray-900/5 dark:ring-white/10 overflow-hidden transform transition-all animate-[fadeInUp_0.3s_ease-out]`}>
        {children}
      </div>
    </div>
  );
};