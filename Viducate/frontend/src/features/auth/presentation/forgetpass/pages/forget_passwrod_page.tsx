import { AuthMainText } from "../../../../../core/componants/auth_text_section";
import { SubmitEmailSection } from "../componants/submit_email_section";
import AuthLayout from "../../layouts/AuthLayout";
import { RightSection } from "../componants/right_section";
export function ForgetPasswordPage() {
  return (
    <AuthLayout
      LeftContent={

          <div>
            <AuthMainText
              bigTitle="Forget password?"
              smallTitle="Enter your email to reset your password"
            />

            <SubmitEmailSection />
          </div>
     
      }
      RightContent={<RightSection imgSrc={"src/assets/forget_pass_1.svg"} titleFirstPart={"Securely reset your password"} titleColoredPart={" and continue your learning journey"} description={"It only takes a few seconds to get back on track"}/>}
      
    />
    // <div
    //  className="min-h-screen grid grid-cols-1 md:grid-cols-2 font-display">

    //   {/* Left Section */}
    // <div className="flex flex-col py-4 px-6 md:px-15">
    //   <Logo />

    //   <div className="flex flex-col flex-1 justify-center items-center text-center md:text-left">
    //     <AuthMainText
    //       bigTitle="Forget password?"
    //       smallTitle="Enter your email to reset your password"
    //     />

    //     <SubmitEmailSection />
    //   </div>
    // </div>

    //   {/* Right Section */}
    //   <div className="hidden md:flex flex-col items-center bg-gray-50 p-4">
    //     <RightSection />
    //   </div>

    // </div>
  );
}
