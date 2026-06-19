import { AlertCircle, Check, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { COLORS } from "../constants/colors";

type CustomInputProps = {
  label: string;
  type?: string;
  value: string;
  placeholder?: string;
  error?: string;
  success?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function CustomInput({
  label,
  type = "text",
  value,
  placeholder,
  error,
  success = false,
  onChange,
}: CustomInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPasswordField = type === "password";
  const isEmpty = value.length === 0;
  const isError = !!error;
  const isSuccess = success && !isError && !isEmpty;

  const inputType =
    isPasswordField && showPassword ? "text" : type;

 const borderColor = isError
  ? COLORS.state.error
  : isSuccess
  ? COLORS.state.success
  : isFocused
  ? COLORS.border.focus
  : COLORS.border.default;

  return (
    <div className="w-full py-2 font-display">
      <p className="text-sm font-medium mb-2 ">{label}</p>

      <div className="relative">
        <input
          type={inputType}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          style={{ borderColor }}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
          className="w-full h-12 px-4 pr-12 rounded-xl border-2 transition-all focus:outline-none "
        />

        {/* Right Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {(isError&&!isPasswordField) ? (
            <AlertCircle
              size={18}
              style={{ color: COLORS.state.error }}
            />
          ) : isSuccess ? (
            <Check
              size={18}
              className="text-white rounded-full p-1"
              style={{ backgroundColor: COLORS.state.success }}
            />
          ) : isPasswordField ? (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="focus:outline-none cursor-pointer"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          ) : null}
        </div>
      </div>

      {isError && !isEmpty && (
        <p
          className="text-sm mt-2"
          style={{ color: COLORS.state.error }}
        >
          {error}
        </p>
      )}
    </div>
  );
}