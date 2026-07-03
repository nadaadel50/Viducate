import { Search } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { FONT_SIZE } from "../../../../core/constants/fonts_update";
import { useIntl } from "react-intl";
type SearchTopicBarProps = {
  setSearchQuery: Dispatch<SetStateAction<string>>;
};

export function SearchTopicBar({ setSearchQuery }: SearchTopicBarProps) {
  const intl = useIntl();
  return (
    <div className="group relative flex items-center">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#4f46e5]" />

      <input
        type="text"
        placeholder={intl.formatMessage({
          id: "watch.searchTopics",
        })}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={`w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-3 shadow-sm transition-colors duration-200 placeholder:text-slate-400 focus:border-[#4f46e5] 
          focus:outline-none focus:ring-1 focus:ring-[#4f46e5] ${FONT_SIZE.size12}`}
      />
    </div>
  );
}
