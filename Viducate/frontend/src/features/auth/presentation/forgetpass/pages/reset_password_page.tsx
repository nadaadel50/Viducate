import { RightSection } from "../../componants/right_section";
import AuthLayout from "../../layouts/AuthLayout";
import { ResetPasswordLeftSection } from "../componants/reset_pass_left_section";

export function ResetPasswordPage(){
    return (
       <AuthLayout 
       LeftContent={<ResetPasswordLeftSection/>} 
      RightContent={<RightSection imgSrc={"src/assets/images/reset_pass.svg"} titleFirstPart={"Secure your account to"} titleColoredPart={" unlock knowledge."} 
      description={"Keep your learning journey safe. Set astrong password to continue accessing AI-powered insights."}/>}/>
    
     
    
    )
}