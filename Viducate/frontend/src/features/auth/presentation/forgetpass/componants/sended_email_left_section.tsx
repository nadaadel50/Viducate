import { ExternalLink, Mail } from "lucide-react";
import { COLORS } from "../../../../../core/constants";
import { AuthMainText } from "../../componants/auth_text_section";
import { CustomButton } from "../../../../../core/componants/custum_btn";
import { ClickToResend } from "./click_to_resend";
export function SendedEmailLeftSection() {
  return (
    <div className="w-full flex flex-col justify-center  items-center pr-16  ">
      <div
        style={{ background: COLORS.icon.background }}
        className="flex justify-center items-center w-20 h-20 rounded-3xl"
      >
        <Mail
          strokeWidth={2}
          style={{ color: COLORS.icon.primary }}
          className="w-10 h-10 "
        />
      </div>

      <div className="mt-5 mb-8 flex flex-col items-center">
        <AuthMainText
          bigTitle={"Check your email"}
          smallTitle={"We've sent a password reset link to"}
        />
        <p>student@university.edu</p> {/*will change soon */}
      </div>

      <div onClick={()=>{
        window.open("https://mail.google.com", "_blank")

      }} className="w-full relative px-10">
        <CustomButton>Open email app</CustomButton>
        <div className="absolute right-42 top-1/2 -translate-y-1/2">
          <ExternalLink
            strokeWidth={2}
            style={{ color: COLORS.icon.secondry }}
            className="w-5 h-5 "
          />
        </div>
      </div>

     <ClickToResend/>
    </div>
  );
}
