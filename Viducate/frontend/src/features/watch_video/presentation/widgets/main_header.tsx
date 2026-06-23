import { Clock4, Save } from "lucide-react";

import { MediaBtn } from "./media_btn";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";

import { useHandleSaveProgress } from "../hook/use_handle_save_progress";
import { Toast } from "../../../../core/componants/toast_message";

export function MainHeader() {
  const formatDuration = (start: number, end: number) => {
    const duration = end - start;

    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  const { selectedTopic, handleSetHasUnsavedChanges } =
    useLearningSession();

  const { handleSaveProgress, toastMessage, toastType, clearToast } =
    useHandleSaveProgress();

  return (
    <div className=" pt-12  ">
      <Toast message={toastMessage} type={toastType} onClose={clearToast} />
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-6 ">
        {selectedTopic?.title}
      </h1>

      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-1.5 items-center ">
          <Clock4 className="w-4 h-4 text-slate-500" />
          <p className="text-sm text-slate-500">
            {selectedTopic
              ? formatDuration(selectedTopic.start_time, selectedTopic.end_time)
              : "0:00"}
          </p>
        </div>

        <div className="flex gap-2 ">
          <div className="flex items-center gap-3">
            <MediaBtn
              icon={<Save size={18} />}
              label="Save"
              onClick={() => {
                handleSaveProgress();

                handleSetHasUnsavedChanges(false);
              }}


              
            />

             

          </div>

        </div>
      </div>
    </div>
  );
}
