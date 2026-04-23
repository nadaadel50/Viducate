

type InputSectionProps={
  title:string,
  error:boolean
  handleTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
}

export function InputSection({title,error,handleTitle}:InputSectionProps) {
 
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

        

      </div>
    </>
  );
}
