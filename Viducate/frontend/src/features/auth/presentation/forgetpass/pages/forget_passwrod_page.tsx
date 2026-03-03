import { ForgetPassLeftSection } from "../componants/forget_pass_left_section";
import AuthLayout from "../../layouts/AuthLayout";

import { AuthMainText } from "../../componants/auth_text_section";
import { RightSection } from "../../componants/right_section";
export function ForgetPasswordPage() {
  return (
    <AuthLayout
      LeftContent={

          <div className="pr-16">
            <AuthMainText
              bigTitle="Forget password?"
              smallTitle="Enter your email to reset your password"
            />

            <ForgetPassLeftSection />
          </div>
     
      }
      RightContent={<RightSection imgSrc={"src/assets/images/forget_pass_1.svg"} titleFirstPart={"Securely reset your password"} titleColoredPart={" and continue your learning journey"} description={"It only takes a few seconds to get back on track"}/>}
      
    />
   
  );
}
