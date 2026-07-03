import React from "react";
import { FormattedMessage } from "react-intl";
import { COLORS } from "../../../../core/constants";

interface PreferenceCardProps {
  title: string;
  desc: string;
  icon: string;
  value: string;
  onChange: (val: string) => void;
  iconBgClass?: string;
  iconTextClass?: string;
}

export const PreferenceCard: React.FC<PreferenceCardProps> = ({
  title,
  desc,
  icon,
  value,
  onChange,
  iconBgClass,
  iconTextClass,
}) => (
  <div className="group flex flex-col rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#6366f1] transition-all duration-300">
    <div className="p-5 flex flex-col h-full gap-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${iconBgClass} ${iconTextClass}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>

        <h3
          className="font-bold text-lg"
          style={{ color: COLORS.text.primary }}
        >
          {title}
        </h3>
      </div>

      <p
        className="text-sm leading-relaxed h-10"
        style={{ color: COLORS.text.secondary }}
      >
        {desc}
      </p>

      <div className="mt-auto pt-4 border-t border-gray-100">
        <label
          className="block text-xs font-bold mb-2 uppercase tracking-wide"
          style={{ color: COLORS.text.secondary }}
        >
          <FormattedMessage id="preferences.outputLanguage" />
        </label>

        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none bg-gray-50 border border-gray-200 text-sm rounded-lg p-2.5 pr-8 outline-none focus:ring-1 focus:ring-[#6366f1] cursor-pointer disabled:cursor-not-allowed"
          >
            <option value="Same as Video">
              <FormattedMessage id="preferences.sameAsVideo" />
            </option>

            <option value="en">
              <FormattedMessage id="preferences.english" />
            </option>

            <option value="ar">
              <FormattedMessage id="preferences.arabic" />
            </option>
          </select>

          <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 pointer-events-none text-[20px]">
            expand_more
          </span>
        </div>
      </div>
    </div>
  </div>
);
