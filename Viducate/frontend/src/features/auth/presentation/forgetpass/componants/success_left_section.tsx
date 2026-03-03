import {  CircleCheck, ExternalLink, Mail } from "lucide-react";
import { COLORS } from "../../../../../core/constants";
import { CustomButton } from "../../../../../core/componants/custum_btn";
export function SucessLeftSection() {
  return (
    <div className="w-full flex flex-col justify-center  items-center pr-16  ">
      <div
        
        className="flex justify-center items-center w-20 h-20 rounded-3xl bg-[#C8E6C9]"
      >
        <CircleCheck 
          strokeWidth={2}
       
          className="w-10 h-10 text-[#2E7D32] "
        />
      </div>

      <div className="mt-5 mb-8 flex flex-col items-center text-center">
        
         <h2 className="lg:text-4xl font-black  leading-tight tracking-[-0.033em] mb-3">
         Password reset
         <br />
         <span>successful</span>
        </h2>
        
        <p className="text-lg text-[#636988] dark:text-gray-300">Your password has been successfully updated. You can now access your study library with your new credentials.</p >
       
      </div>

      <div onClick={()=>{
        window.open("https://mail.google.com", "_blank")

      }} className="w-full relative px-10">
        <CustomButton>Back to login</CustomButton>
        <div className="absolute right-42 top-1/2 -translate-y-1/2">
          <ExternalLink
            strokeWidth={2}
            style={{ color: COLORS.icon.secondry }}
            className="w-5 h-5 "
          />
        </div>
      </div>

     
    </div>
  );
}
