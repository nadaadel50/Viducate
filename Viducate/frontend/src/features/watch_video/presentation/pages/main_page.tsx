import { LeftContentSection } from "../sections/left_content_section";
import { RightContentSection } from "../sections/right_content_section";

export function MainPage() {
  return (
    <>
    <div className="flex  font-display  ">
        <div className="flex-1  ">

           <LeftContentSection/>

        </div>





        <div className="flex-[3.5]  bg-red-100">
          <RightContentSection/>
        </div>

    </div>
    </>
  );
}