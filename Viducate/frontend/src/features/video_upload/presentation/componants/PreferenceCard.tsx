import React from 'react';
import { FormattedMessage } from "react-intl";
interface PreferenceCardProps {
  title: string;
  desc: string;
  icon: string;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  iconBgClass?: string;
  iconTextClass?: string;
}

export const PreferenceCard: React.FC<PreferenceCardProps> = ({ 
  title, desc, icon, value, onChange, disabled, iconBgClass, iconTextClass
}) => (
  <div className={`group flex flex-col rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-[#6366f1] transition-all duration-300  ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
    <div className="p-5 flex flex-col h-full gap-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${iconBgClass} ${iconTextClass}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <h3 className="font-bold text-lg text-[#111318] dark:text-white">{title}</h3>
      </div>
      <p className="text-sm text-[#616f89] dark:text-gray-400 leading-relaxed h-10">{desc}</p>
      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
      <label className="block text-xs font-bold text-[#616f89] dark:text-gray-500 mb-2 uppercase tracking-wide">
  <FormattedMessage id="preferences.outputLanguage" />
</label>
        <div className="relative">
          
<select 
  value={value} 
  onChange={(e) => onChange(e.target.value)}
  disabled={disabled}
  className="w-full appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm rounded-lg p-2.5 pr-8 outline-none focus:ring-1 focus:ring-[#6366f1] cursor-pointer disabled:cursor-not-allowed"
>
  {disabled && <option value="preferred Language"><FormattedMessage id="customize.preferredLanguage" /></option>}
  
  <option value="Same as Video">
  <FormattedMessage id="preferences.sameAsVideo" />
</option>

<option value="English">
  <FormattedMessage id="preferences.english" />
</option>

<option value="Arabic">
  <FormattedMessage id="preferences.arabic" />
</option>
</select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 pointer-events-none text-[20px]">expand_more</span>
        </div>
      </div>
    </div>
  </div>
);
