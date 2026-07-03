import { ForgetPassLeftSection } from "../componants/forget_pass_left_section";
import AuthLayout from "../layouts/auth_layout";
import { RightSection } from "../componants/right_section";
import ForgetPassAnimaion from "../../../../core/animations/forgetpass_ani";
import { useT } from "../../../../core/hooks/useTranslation";

export function ForgetPasswordPage() {
  const { translation } = useT();

  return (
    <AuthLayout
      LeftContent={<ForgetPassLeftSection />}
      RightContent={
        <RightSection
          animation={true}
          animationComponant={<ForgetPassAnimaion />}
          titleFirstPart={translation("auth.forgetPasswordPage.titleFirst")}
          titleColoredPart={translation("auth.forgetPasswordPage.titleColored")}
          description={translation("auth.forgetPasswordPage.description")}
        />
      }
    />
  );
}
