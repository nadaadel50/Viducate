import { Info, AlertCircle, Youtube } from "lucide-react";

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
  return (
    <div className="w-full mt-10 mb-6 rounded-2xl border border-[#DDD9FB] bg-[#F8F7FF] p-7">
      <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
        Video URL
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
          placeholder="https://www.youtube.com/watch?v=..."
          className={`w-full pl-9 pr-20 py-2.5 text-sm rounded-xl border bg-white outline-none transition-all
            ${
              error
                ? "border-red-400 ring-3 ring-red-100"
                : "border-[#E0DCFB] focus:border-indigo-400 focus:ring-3 focus:ring-[#EEEDFE]"
            }`}
        />

        <button
          onClick={handlePaste}
          className="absolute right-2 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
        >
          Paste
        </button>
      </div>

      <p
        className={`flex items-center gap-1.5 mt-2.5 text-xs transition-colors
          ${error ? "text-red-500" : "text-gray-400"}`}
      >
        {error ? (
          <>
            <AlertCircle size={13} className="shrink-0" />
            Please enter a valid URL starting with https://
          </>
        ) : (
          <>
            <Info size={13} className="shrink-0" />
            Make sure the video is public or unlisted so our AI can access it.
          </>
        )}
      </p>
    </div>
  );
}
