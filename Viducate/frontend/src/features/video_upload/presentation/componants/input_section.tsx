

type InputSectionProps={
  title:string,
  error:boolean
  handleTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTextArea: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  textArea:string
}

export function InputSection({title,error,handleTitle,textArea,handleTextArea}:InputSectionProps) {
 
  return (
    <>
      <div className="w-full">
        <p className="text-sm font-medium mb-2">{"Video Title"}</p>
        <input
          value={title}
          placeholder="e.g. Intro to Macroeconomics - Week 1"
          className={`w-full h-12 px-4 rounded-xl border-2 transition-all focus:outline-none
  ${error ? "border-red-500 focus:border-red-500" : "border-[#dcdde5] focus:border-[#6366f1]"}`}
          type="text"
          onChange={handleTitle}
        />

        <div className="flex text-sm font-medium mb-2 mt-8 gap-2">
          <p className="">{"Description"}</p>
          <p className="text-gray-400">{"(Optional)"}</p>
        </div>

        <textarea
          value={textArea}
          onChange={handleTextArea}
          placeholder={
            "Add any notes, key topics, or context for the AI analysis..."
          }
          className=" h-32 w-full h-12 p-4  rounded-xl border-2 transition-all focus:outline-none border-[#dcdde5] focus:border-[#6366f1] resize-none "
        />
      </div>
    </>
  );
}
