import type { ReactNode } from "react";
import clsx from "clsx";
import { AlertTriangle, Loader2 } from "lucide-react";

import { CustomButton } from "./custum_btn";

import { FONT_SIZE, FONT_WEIGHT, LINE_HEIGHT } from "../constants/fonts_update";
import { BaseModal } from "./base_modal";
import { useIntl } from "react-intl";
type ConfirmationModalProps = {
  open: boolean;
  title: string;
  description: string;

  confirmText?: string;
  cancelText?: string;

  confirmVariant?: "danger" | "primary" | "success" | "warning";

  icon?: ReactNode;

  isLoading?: boolean;

  onClose: () => void;
  onConfirm: () => void;
};

const VARIANTS = {
  danger: {
    icon: "bg-red-50 text-red-500",
    button: "bg-red-500 hover:bg-red-600 text-white",
  },
  primary: {
    icon: "bg-blue-50 text-blue-500",
    button: "bg-blue-500 hover:bg-blue-600 text-white",
  },
  success: {
    icon: "bg-green-50 text-green-500",
    button: "bg-green-500 hover:bg-green-600 text-white",
  },
  warning: {
    icon: "bg-yellow-50 text-yellow-600",
    button: "bg-yellow-500 hover:bg-yellow-600 text-white",
  },
} as const;

export function ConfirmationModal({
  open,
  title,
  description,
  confirmText,
  cancelText,
  confirmVariant = "danger",
  icon,
  isLoading = false,
  onClose,
  onConfirm,
}: ConfirmationModalProps) {
  const intl = useIntl();
  const variant = VARIANTS[confirmVariant];
  const finalConfirmText =
    confirmText ??
    intl.formatMessage({
      id: "common.confirm",
    });

  const finalCancelText =
    cancelText ??
    intl.formatMessage({
      id: "common.cancel",
    });
  return (
    <BaseModal isOpen={open} onClose={onClose} maxWidth="max-w-sm">
      <div className="p-5 sm:p-6">
        <div
          className={clsx(
            "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full shadow-sm",
            variant.icon,
          )}
        >
          {icon ?? <AlertTriangle size={22} />}
        </div>

        <div className="text-center">
          <h3
            className={clsx(
              FONT_SIZE.size18,
              FONT_WEIGHT.bold,
              "mb-2 text-slate-900",
            )}
          >
            {title}
          </h3>

          <p
            className={clsx(
              FONT_SIZE.size14,
              LINE_HEIGHT.relaxed,
              "mb-6 text-slate-500",
            )}
          >
            {description}
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <CustomButton
            disabled={isLoading}
            onClick={onClose}
            className="border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
          >
            {finalCancelText}
          </CustomButton>

          <CustomButton
            disabled={isLoading}
            onClick={onConfirm}
            className={clsx("shadow-md", variant.button)}
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              finalConfirmText
            )}
          </CustomButton>
        </div>
      </div>
    </BaseModal>
  );
}
