import { AlertCircle, Check, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { COLORS } from "../constants/colors";
import { FONT_STYLES } from "../constants/fonts";
import { useLanguage } from "../hooks/useLanguage";

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
  const { isRTL } = useLanguage();
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
    <div className="w-full py-1 mb-2 font-display">
      <label className={`${FONT_STYLES.subtitle} block mb-1.5`}>{label}</label>

      <div className="relative">
        <input
          type={inputType}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          style={{ borderColor }}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
          className={`
            w-full h-10 px-3 md:px-4
            ${isRTL ? 'pl-10 pr-3' : 'pr-10 pl-3'}
            ${FONT_STYLES.body}
            rounded-lg border-2 transition-all focus:outline-none
          `}
        />

        <div className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 flex items-center`}>
          {isError && !isPasswordField ? (
            <AlertCircle size={16} style={{ color: COLORS.state.error }} />
          ) : isSuccess ? (
            <Check size={16} className="text-white rounded-full p-0.5" style={{ backgroundColor: COLORS.state.success }} />
          ) : isPasswordField ? (
            <button type="button" onClick={() => setShowPassword(prev => !prev)} className="focus:outline-none cursor-pointer">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          ) : null}
        </div>
      </div>

      {isError && !isEmpty && (
        <p className={`${FONT_STYLES.caption} mt-1`} style={{ color: COLORS.state.error }}>{error}</p>
      )}
    </div>
  );
}
