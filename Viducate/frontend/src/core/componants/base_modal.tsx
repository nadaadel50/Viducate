import type { ReactNode } from "react";
import { createPortal } from "react-dom";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}

export function BaseModal({
  isOpen,
  onClose,
  children,
  maxWidth = "max-w-5xl",
}: BaseModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 font-display">
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative flex max-h-[90vh] w-full ${maxWidth} flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/5`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
