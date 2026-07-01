import { Info, AlertCircle, Youtube } from "lucide-react";
import { FONT_STYLES } from "../../../../core/constants/fonts";
import { FormattedMessage, useIntl } from "react-intl";
type LinkSectionProps = {
  url: string;
  error: boolean;
  handleUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePaste: () => void;
};

export function LinkSection({
  url,
  error,
  handleUrlChange,
  handlePaste,
}: LinkSectionProps) {
  const intl = useIntl();
  return (
    <div className="w-full mt-6 md:mt-8 mb-4 md:mb-6 rounded-xl md:rounded-2xl border border-[#DDD9FB] bg-[#F8F7FF] p-4 md:p-6">
      <p
        className={`${FONT_STYLES.caption} font-medium mb-2 uppercase tracking-wide`}
      >
        <FormattedMessage id="upload.link.videoUrl" />
      </p>

      <div className="relative flex items-center">
        <Youtube
          size={16}
          className="absolute left-3 text-indigo-300 pointer-events-none"
        />

        <input
          value={url}
          onChange={handleUrlChange}
          type="text"
          placeholder={intl.formatMessage({
            id: "upload.link.placeholder",
          })}
          className={`
            w-full
            pl-9
            pr-16 md:pr-20
            py-2 md:py-2.5
            ${FONT_STYLES.input}
            rounded-lg md:rounded-xl
            border
            bg-white
            outline-none
            transition-all
            ${
              error
                ? "border-red-400 ring-2 ring-red-100"
                : "border-[#E0DCFB] focus:border-indigo-400 focus:ring-2 focus:ring-[#EEEDFE]"
            }
          `}
        />

        <button
          onClick={handlePaste}
          className="absolute right-2 px-2.5 md:px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
        >
          <FormattedMessage id="upload.link.paste" />
        </button>
      </div>

      <p
        className={`flex items-start gap-1.5 mt-2.5 ${FONT_STYLES.caption} transition-colors ${
          error ? "text-red-500" : "text-gray-400"
        }`}
      >
        {error ? (
          <>
            <AlertCircle size={13} className="shrink-0 mt-0.5" />
            <FormattedMessage id="upload.link.invalidUrl" />
          </>
        ) : (
          <>
            <Info size={13} className="shrink-0 mt-0.5" />
            <FormattedMessage id="upload.link.info" />
          </>
        )}
      </p>
    </div>
  );
}
