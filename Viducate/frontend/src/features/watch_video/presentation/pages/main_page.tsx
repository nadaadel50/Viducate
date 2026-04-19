import { LeftContentSection } from "../sections/left_content_section";
import { RightContentSection } from "../sections/right_content_section";

export function MainPage() {
  return (
    <>
    <div className="flex  font-display bg-[#f8fafc]  ">
        <div className="flex-1 border-r border-slate-200 ">

           <LeftContentSection/>

        </div>





        <div className="flex-[3.5] ">
          <RightContentSection/>
        </div>

    </div>
    </>
  );
}