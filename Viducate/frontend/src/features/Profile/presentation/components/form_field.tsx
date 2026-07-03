import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { COLORS } from "../../../../core/constants/colors";

interface FormFieldProps {
  id: string;
  labelId: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholderId?: string;
  required?: boolean;
}

export function FormField({
  id,
  labelId,
  type = "text",
  value,
  onChange,
  placeholderId,
  required,
}: FormFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-2">
      
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-slate-700 ml-1"
      >
        <FormattedMessage id={labelId} />
      </label>

      
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholderId ? undefined : undefined}
        className="w-full rounded-xl border bg-white text-slate-900 outline-none px-4 py-3 transition-all duration-200 hover:border-slate-300 shadow-sm"
        style={{
          borderColor: focused ? COLORS.brand.primary : "#e2e8f0",
          boxShadow: focused ? `0 0 0 4px ${COLORS.brand.primary}20` : "none",
        }}
      />
    </div>
  );
}
