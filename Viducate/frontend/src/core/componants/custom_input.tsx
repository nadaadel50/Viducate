import { AlertCircle, Check } from "lucide-react";
import { COLORS } from "../constants/colors";

type CustomInputProps = {
  label: string;
  type?: string;
  value: string;
  placeholder?: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function CustomInput({
  label,
  type = "text",
  value,
  placeholder,
  error,
  onChange,
}: CustomInputProps) {
  const isEmpty = value.length === 0;
  const isError = !!error;

  const borderColor = isEmpty
    ? COLORS.borderDefault
    : isError
    ? COLORS.error
    : COLORS.success;

  return (
    <div className="w-full py-4">
      <p className="text-sm font-medium mb-2">{label}</p>

      <div className="relative">
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          style={{ borderColor }}
          className="w-full h-12 px-4 pr-10 rounded-xl border-2 transition-all focus:outline-none"
          onFocus={(e) => {
            if (isEmpty) {
              e.currentTarget.style.borderColor = COLORS.borderFocus;
            }
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = borderColor;
          }}
        />

        {!isEmpty &&
          (isError ? (
            <AlertCircle
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: COLORS.error }}
              size={18}
            />
          ) : (
            <Check
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white rounded-full p-1"
              style={{ backgroundColor: COLORS.success }}
              size={18}
            />
          ))}
      </div>

      {isError&&!isEmpty && (
        <p
          className="text-sm mt-2"
          style={{ color: COLORS.error }}
        >
          {error}
        </p>
      )}
    </div>
  );
}