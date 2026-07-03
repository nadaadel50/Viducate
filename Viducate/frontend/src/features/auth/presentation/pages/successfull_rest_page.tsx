import SuccessResetAnimation from "../../../../core/animations/sucess_reset_ani";
import { RightSection } from "../componants/right_section";
import AuthLayout from "../layouts/auth_layout";
import { SucessLeftSection } from "../componants/success_left_section";
import { useT } from "../../../../core/hooks/useTranslation";

export function SuccessfullResetPage() {
  const { translation } = useT();

  return (
    <AuthLayout
      LeftContent={<SucessLeftSection />}
      RightContent={
        <RightSection
          animation={true}
          animationComponant={<SuccessResetAnimation />}
          titleFirstPart={translation("auth.resetSuccessPage.title")}
          titleColoredPart={" "}
          description={translation("auth.resetSuccessPage.description")}
        />
      }
    />
  );
}
