import { Check, Circle, X } from "lucide-react";

type Props = {
  password: string;
};

export function PasswordRequirements({ password }: Props) {
  const validations = {
    length: password.length >= 8,
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password),
  };

  const renderIcon = (isValid: boolean) => {
    if (password.length === 0)
      return <Circle className="w-[16px] text-gray-500" />;

    return isValid ? (
      <Check className="w-[18px] text-green-500" />
    ) : (
      <X className="w-[18px] text-red-500" />
    );
  };

  return (
    <div className="w-full mt-2 rounded-xl bg-gray-50 border border-gray-100 px-5 py-5">
      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">
        Password requirements:
      </p>

      <ul className="flex flex-col gap-2 text-sm text-[#636988]">
        <li className="flex items-center gap-2">
          {renderIcon(validations.length)}
          At least 8 characters long
        </li>

        <li className="flex items-center gap-2">
          {renderIcon(validations.number)}
          Contains at least one number
        </li>

        <li className="flex items-center gap-2">
          {renderIcon(validations.special)}
          Contains at least one special character
        </li>
      </ul>
    </div>
  );
}