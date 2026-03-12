import { Video } from "lucide-react";


type VideoDragedSectionProps={
    videoFile:File|null
    handleCancel:()=>void
   
}

export function VideoDragedSection({videoFile,handleCancel}:VideoDragedSectionProps) {
  return (
    <>
      <div className=" bg-gray-50  w-full flex   mt-10 py-5 border-2  border-gray-200 rounded-2xl   mb-10">
        <div className="w-full  p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center justify-center  p-3 rounded-xl bg-[#ececf7] text-[#4f46e5] ">
            <Video />
          </div>
          <div className=" w-full ml-4">
            <div className="flex-1">
              <p className="font-medium">{`${videoFile?.name}`}</p>

             
            </div>
          </div>

          <button
          onClick={handleCancel}
           className="ml-4 text-gray-500 hover:text-red-500 text-xl cursor-pointer">
            
            ✕
          </button>
        </div>
      </div>
    </>
  );
}
