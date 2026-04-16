import { Clock4, FolderUp, Save, Share2 } from "lucide-react";
import { MediaBtn } from "../widgets/media_btn";
import { VideoPlayer } from "../widgets/video_part";


export function RightContentSection() {
  return (
    <div className="flex flex-col px-10 py-20">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
        {" "}
        Understanding Limit Laws
      </h1>

      <div className="flex  justify-between items-center">
        <div className="flex gap-1.5 items-center ">
          <Clock4 className=" w-4 h-4 " />
          <p className="text-sm">45 min</p>
        </div>

        <div className="flex gap-2">
          <MediaBtn
            icon={<FolderUp className="w-5 h-5" />}
            label={"Export"}
            onClick={() => {}}
          />
          <MediaBtn
            icon={<Save className="w-5 h-5" />}
            label={"Save"}
            onClick={() => {}}
          />
          <MediaBtn
            icon={<Share2 className="w-5 h-5" />}
            label={"Share"}
            onClick={() => {}}
          />
        </div>
      </div>

      {/* video  */}

      <div className="flex justify-center mt-10 bg-transparent">
        <VideoPlayer />
      </div>
    </div>
  );
}
