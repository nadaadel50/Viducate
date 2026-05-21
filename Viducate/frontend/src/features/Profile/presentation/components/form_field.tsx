import { COLORS } from "../../../../core/constants/colors";
import { useState } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}: FormFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-2">
      <label
        className="block text-sm font-semibold text-slate-700 ml-1"
        htmlFor={id}
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full rounded-xl border bg-white text-slate-900 outline-none px-4 py-3 transition-all duration-200 hover:border-slate-300 shadow-sm"
        style={{
          borderColor: focused
            ? COLORS.brand.primary
            : "#e2e8f0",

          boxShadow: focused
            ? `0 0 0 4px ${COLORS.brand.primary}20`
            : "none",
        }}
      />
    </div>
  );
}