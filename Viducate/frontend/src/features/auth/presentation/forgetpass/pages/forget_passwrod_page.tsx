import { Logo } from "../../../../../core/componants/logo";
  import { AuthMainText } from "../../../../../core/componants/auth_text_section";
import { RightSection } from "../componants/right_section";
import { SubmitEmailSection } from "../componants/submit_email_section";
export function ForgetPasswordPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 font-display">
      
      {/* Left Section */}
      <div className="flex flex-col py-4 px-6 md:px-15">
        <Logo />

        <div className="flex flex-col flex-1 justify-center items-center text-center md:text-left">
          <AuthMainText
            bigTitle="Forget password?"
            smallTitle="Enter your email to reset your password"
          />

          <SubmitEmailSection />
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden md:flex flex-col items-center bg-gray-50 p-4">
        <RightSection />
      </div>

    </div>
  );
}
