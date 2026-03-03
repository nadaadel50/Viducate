import { RightSection } from "../../componants/right_section";
import AuthLayout from "../../layouts/AuthLayout";
import { SendedEmailLeftSection } from "../componants/sended_email_left_section";

export function EmailSendedPage(){
    return (
       <AuthLayout 
       LeftContent={<SendedEmailLeftSection/>} 
      RightContent={<RightSection imgSrc={"src/assets/images/email_sent.svg"} titleFirstPart={"We’ve sent a password reset link"} titleColoredPart={" to your email address"} description={"It only takes a few seconds to get back on track"}/>}/>
    
     
    
    )
}