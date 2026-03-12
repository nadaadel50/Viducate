import { Video } from "lucide-react";


type UploadLoadingSectionProps={
    title:string
    handleCancel: () => void
}

export function UploadLoadingSection({title,handleCancel}:UploadLoadingSectionProps) {
  return (
    <>
      <div className=" bg-gray-50  w-full flex   mt-10 py-12 border-2  border-gray-200 rounded-2xl   mb-10">
        <div className="w-full  p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center justify-center  p-3 rounded-xl bg-[#ececf7] text-[#4f46e5] ">
            <Video />
          </div>
          <div className=" w-full ml-4">
            <div className="flex-1">
              <p className="font-medium">{`${title}.mp4`}</p>

              <div className="w-full bg-gray-300 h-2 rounded-full mt-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full"
                  style={{ width: "45%" }}
                />
              </div>

              <p className="text-sm text-gray-500 mt-1">
                Uploading... 2 mins remaining
              </p>
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
