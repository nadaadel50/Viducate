import { UploadCloud } from "lucide-react";
import { COLORS } from "../../../../core/constants";


export type UploadSectionProps = {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleBrowseClick: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
};

export function UploadSection(props:UploadSectionProps) {
  
  return (
    <div
      onDragOver={props.handleDragOver}
      onDrop={props.handleDrop}
      className=" group  bg-gray-50 hover:bg-blue-50  w-full flex flex-col items-center mt-10 py-12 border-2 border-dashed border-gray-300 rounded-2xl transition-colors cursor-pointer  mb-10 "
    >
      <div onClick={props.handleBrowseClick}
        style={{ background: COLORS.brand.gradient }}
        className="flex justify-center items-center rounded-full p-4  "
      >
        <UploadCloud strokeWidth={2} className="w-10 h-10 text-white  transition-transform duration-300 group-hover:scale-110 " />
      </div>

      <div className="flex flex-col items-center mt-5 mb-5">
        <h2 className="text-lg font-bold text-gray-900">
          {"Drag & drop video"}
        </h2>
        <p className="text-gray-500  text-sm ">
          {"Supported formats: MP4, MOV, AVI up to 2GB"}
        </p>
      </div>

      <input
        type="file"
        ref={props.fileInputRef}
        accept="video/*"
        className="hidden"
        onChange={props.handleFileChange}
      />

      <button
        onClick={props.handleBrowseClick}
        className="px-6 py-2.5 bg-white cursor-pointer  border border-gray-300  rounded-lg text-sm font-semibold text-gray-700  hover:bg-gray-50 transition-colors shadow-sm"
      >
        Browse Files
      </button>
     
    </div>
  );
}
