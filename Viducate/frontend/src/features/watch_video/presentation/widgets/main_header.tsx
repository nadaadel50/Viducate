import { Clock4, Save, FolderUp, Share2 } from "lucide-react";
import { useSelectedTopic } from "../context/topic_context";
import { MediaBtn } from "./media_btn";

export function MainHeader() {
    const formatDuration = (start: number, end: number) => {
        const duration = end - start;
    
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
    
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
      };
      const { selectedTopic } = useSelectedTopic();
    return (
         <div className="px-6 pt-15 ">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          {selectedTopic?.title}
        </h1>

        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-1.5 items-center ">
            <Clock4 className="w-4 h-4 text-slate-500" />
            <p className="text-sm text-slate-500">
              {selectedTopic
                ? formatDuration(
                    selectedTopic.start_time,
                    selectedTopic.end_time,
                  )
                : "0:00"}
            </p>
          </div>

          <div className="flex gap-2">
            <   MediaBtn
              icon={<FolderUp size={18} />}
              label="Export"
              onClick={() => {}}
            />
            <MediaBtn
              icon={<Save size={18} />}
              label="Save"
              onClick={() => {}}
            />
            <MediaBtn
              icon={<Share2 size={18} />}
              label="Share"
              onClick={() => {}}
            />
          </div>
        </div>
      </div>

    )
}