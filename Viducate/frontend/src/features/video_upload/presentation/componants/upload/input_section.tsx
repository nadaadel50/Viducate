import { AlertCircle, Pencil } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";

type InputSectionProps = {
  title: string;
  error: boolean;
  handleTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function InputSection({ title, error, handleTitle }: InputSectionProps) {
  const intl = useIntl();
  return (
    <div className="w-full">
      <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
        <FormattedMessage id="upload.video.titleLabel" />
      </p>

      <div className="relative flex items-center">
        <Pencil
          size={15}
          className="absolute left-3 text-indigo-300 pointer-events-none"
        />

        <input
          value={title}
          onChange={handleTitle}
          type="text"
          placeholder={intl.formatMessage({
            id: "upload.video.titlePlaceholder",
          })}
          className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border bg-white outline-none transition-all
            ${
              error
                ? "border-red-400 ring-3 ring-red-100"
                : "border-[#E0DCFB] focus:border-indigo-400 focus:ring-3 focus:ring-[#EEEDFE]"
            }`}
        />
      </div>

      {error && (
        <p className="flex items-center gap-1.5 mt-2 text-xs text-red-500">
          <AlertCircle size={13} className="shrink-0" />
          <FormattedMessage id="upload.video.titleRequired" />
        </p>
      )}
    </div>
  );
}
