import { ForgetPassLeftSection } from "../componants/forget_pass_left_section";
import AuthLayout from "../../layouts/AuthLayout";

import { RightSection } from "../../componants/right_section";
import ForgetPassAnimaion from "../../../../../core/animations/forgetpass_ani";
export function ForgetPasswordPage() {
  return (
    <AuthLayout
      LeftContent={

          <div className="pr-16">
           

            <ForgetPassLeftSection />
          </div>
     
      }
      RightContent={<RightSection animation={true} animationComponant={<ForgetPassAnimaion/>} titleFirstPart={"Securely reset your password"} titleColoredPart={" and continue your learning journey"} description={"It only takes a few seconds to get back on track"}/>}
      
    />
   
  );
}
