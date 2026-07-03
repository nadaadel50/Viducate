import EmailSentAnimation from "../../../../core/animations/email_sent_ani";
import { RightSection } from "../componants/right_section";
import AuthLayout from "../layouts/auth_layout";
import { SendedEmailLeftSection } from "../componants/sended_email_left_section";
import { useT } from "../../../../core/hooks/useTranslation";

export function EmailSendedPage() {
  const { translation } = useT();

  return (
    <AuthLayout
      LeftContent={<SendedEmailLeftSection />}
      RightContent={
        <RightSection
          animation={true}
          animationComponant={<EmailSentAnimation />}
          titleFirstPart={translation("auth.emailSentPage.titleFirst")}
          titleColoredPart={translation("auth.emailSentPage.titleColored")}
          description={translation("auth.emailSentPage.description")}
        />
      }
    />
  );
}
