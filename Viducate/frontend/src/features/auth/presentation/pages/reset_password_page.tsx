import LockAnimation from "../../../../core/animations/lock_ani";
import { RightSection } from "../componants/right_section";
import AuthLayout from "../layouts/auth_layout";
import { ResetPasswordLeftSection } from "../componants/reset_pass_left_section";
import { useT } from "../../../../core/hooks/useTranslation";

export function ResetPasswordPage() {
  const { translation } = useT();

  return (
    <AuthLayout
      LeftContent={<ResetPasswordLeftSection />}
      RightContent={
        <RightSection
          animation={true}
          animationComponant={<LockAnimation />}
          titleFirstPart={translation("auth.resetPasswordPage.titleFirst")}
          titleColoredPart={translation("auth.resetPasswordPage.titleColored")}
          description={translation("auth.resetPasswordPage.description")}
        />
      }
    />
  );
}
