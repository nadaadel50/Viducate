import { RightSection } from "../../componants/right_section";
import AuthLayout from "../../layouts/AuthLayout";
import { SucessLeftSection } from "../componants/success_left_section";

export function SuccessfullResetPage(){
    return (
       <AuthLayout 
       LeftContent={<SucessLeftSection/>} 
      RightContent={<RightSection imgSrc={"src/assets/images/success.svg"} titleFirstPart={"You're All Set!"} titleColoredPart={"  "} description={"Continue your learning journey with confidence"}/>}/>
    
     
    
    )
}