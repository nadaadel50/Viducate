import { AlertCircle, CirclePlay } from "lucide-react";

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
    <div className="  bg-gray-50  w-full flex flex-col  mt-10 py-12 border-2  border-gray-200 rounded-2xl   mb-10 ">
      <div className="mx-15 flex flex-col ">
        <p className=" text-sm font-bold text-gray-900 dark:text-white mb-3">
          Video URL
        </p>

        <div className="relative flex items-center justify-center">
          <CirclePlay
            width={18}
            className="absolute left-3 top-7 -translate-y-1/2 text-gray-400 "
          />

          <input
            value={url}
            onChange={handleUrlChange}
            className={`w-full pl-10 py-3 rounded-xl border-2 transition-all focus:outline-none
  ${
    error
      ? "border-red-500 focus:ring-red-200"
      : "border-gray-300 focus:ring-4 focus:ring-[#359EFF]/20 focus:border-[#359EFF]"
  }`}
            type="text"
            placeholder="https://www.youtube.com/watch?v=..."
          />

          <button
            onClick={handlePaste}
            className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-br from-[#359EFF] to-[#5A0BB1] hover:from-[#2f8be0] hover:to-[#4c0997] cursor-pointer  text-white  text-xs font-bold rounded-lg transition-colors"
          >
            PASTE
          </button>
        </div>
        <p className="flex gap-2 mt-3 text-xs text-gray-500  items-center">
          <AlertCircle width={15} strokeWidth={3} />
          Make sure the video is public or unlisted so our AI can access it.
        </p>
      </div>



      
    </div>
  );
}
