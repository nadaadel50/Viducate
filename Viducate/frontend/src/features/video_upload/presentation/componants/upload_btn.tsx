import { ArrowUpFromLine } from "lucide-react";

type UploadBtnProps = {
  videoLink: string;
  videoFile: File | null;
  selected: string;
  uploadedVideoTitle:string;
  linkVideoTitle:string
  videoLinkError:boolean,
  onUploadClick:()=>void

  
};

export function UploadBtn({
  videoLink,
  videoFile,
  selected,
  uploadedVideoTitle,
  linkVideoTitle,
  videoLinkError,
  onUploadClick
}: UploadBtnProps) {
  const isDisabled = !(
    // will be disapled when (uploaded selected &&( no videoFile , no Tile)) or (link selected &&(no link && no title))
    (
      (selected === "link" && !videoLinkError &&videoLink !== ""&&linkVideoTitle!="") ||
      (selected === "upload" && videoFile&&uploadedVideoTitle!="")
    )
  );

  return (
    <div className="w-full flex justify-end mt-10">
      <button
        disabled={isDisabled}
        onClick={// if selected ==link then make somthing  else if selected == upload then make somthing else
          // call api to take the video url or the video file

          onUploadClick
        }
        className={`flex text-sm font-bold w-45 items-center justify-center gap-2 py-2.5 transition-all text-white rounded-xl
        ${
          isDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-br from-[#359EFF] to-[#5A0BB1] hover:from-[#2f8be0] hover:to-[#4c0997] cursor-pointer"
        }`}
      >
        <ArrowUpFromLine   width={18} />
        {selected==="upload"? "Upload Video" : "Upload Link"}
      </button>

      <div></div>
    </div>
  );
}
