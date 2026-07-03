import { Check, Circle, X } from "lucide-react";

type PasswordRequirementItemProps = {
  isValid: boolean;
  label: string;
  showValidation: boolean;
};

export function PasswordRequirementItem({
  isValid,
  label,
  showValidation,
}: PasswordRequirementItemProps) {
  return (
    <li className="flex items-center gap-2">
      {!showValidation ? (
        <Circle className="size-3 text-gray-500" />
      ) : isValid ? (
        <Check className="size-[18px] text-green-500" />
      ) : (
        <X className="size-[18px] text-red-500" />
      )}

      <span>{label}</span>
    </li>
  );
}
