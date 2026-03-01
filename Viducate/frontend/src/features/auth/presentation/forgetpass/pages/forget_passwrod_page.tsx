import { Logo } from "../../../../../core/componants/logo";
import { EmailInputSection } from "../componants/main_section";
import { MainText } from "../componants/text_section";

export function ForgetPasswordPage() {
  return (
    <>
      <div className="min-h-screen  grid grid-cols-2 font-display">
        <div className="flex flex-col min-h-screen py-4 px-6 bg-red-100">
          <Logo />
          <div className="flex flex-col flex-1 justify-center items-center ">
            <MainText
              bigTitle="Forget password?"
              smallTitle="Enter your email to reset your password"
            />
            <EmailInputSection />
          </div>
        </div>

        <div>
          <img src="src/assets/logo.png" alt="" />
        </div>
      </div>
    </>
  );
}
