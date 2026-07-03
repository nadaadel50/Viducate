import { useEffect, useRef, useState } from "react";
import { useDashboard } from "../../hooks/use_dashboard";
import { FormattedMessage } from "react-intl";
export function VideoFilterButton() {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    handleLinkedVideosChange,
    handleUploadedVideosChange,
    linked_videos,
    uploaded_videos,
  } = useDashboard();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside); 

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative ">
      <button
        onClick={() => setOpen(!open)}
        className="cursor-pointer flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
      >
        <span className="material-symbols-outlined ">filter_list</span>
        <FormattedMessage id="dashboard.filter.title" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white shadow-lg p-3 z-50">
          <div className="flex flex-col gap-3">
            {/* Uploaded Videos */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className=" cursor-pointer w-4 h-4 rounded border-indigo-300 accent-[#4f46e5] focus:ring-[#4f46e5]"
                checked={uploaded_videos}
                onChange={(e) => handleUploadedVideosChange(e.target.checked)}
              />

              <span className="text-sm text-slate-700">
                <FormattedMessage id="dashboard.filter.uploadedVideos" />
              </span>
            </label>

            {/* Linked Videos */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="cursor-pointer w-4 h-4 rounded border-indigo-300 accent-[#4f46e5] focus:ring-[#4f46e5]"
                checked={linked_videos}
                onChange={(e) => handleLinkedVideosChange(e.target.checked)}
              />

              <span className="text-sm text-slate-700">
                <FormattedMessage id="dashboard.filter.linkedVideos" />
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
