import { ExternalLink, Mail } from "lucide-react";
import { COLORS } from "../../../../../core/constants";
import { AuthMainText } from "../../componants/auth_text_section";
import { CustomButton } from "../../../../../core/componants/custum_btn";
import { ClickToResend } from "./click_to_resend";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { useForgetPassword } from "../hooks/useForgetPassword";

export function SendedEmailLeftSection() {
  const intl = useIntl();
  const location = useLocation();
  const email = location.state?.email;
  const {fetchRequest}=useForgetPassword();

  
  return (
    <div className="w-full flex flex-col justify-center  items-center pr-16  ">
      <div
        style={{ background: COLORS.icon.background }}
        className="flex justify-center items-center w-20 h-20 rounded-3xl"
      >
        <Mail
          strokeWidth={2}
          style={{ color: COLORS.icon.primary }}
          className="w-10 h-10 "
        />
      </div>

      <div className="mt-5 mb-8 flex flex-col items-center">
        <AuthMainText
          bigTitle={intl.formatMessage({ id: "auth.checkEmail.title" })}
          smallTitle={intl.formatMessage({ id: "auth.checkEmail.subtitle" })}
        />
        <p>{email}</p>
      </div>

      <div
        onClick={() => {
          window.open("https://mail.google.com", "_blank");
        }}
        className="w-full relative px-10"
      >
        <CustomButton>
          {intl.formatMessage({ id: "auth.checkEmail.openEmailApp" })}
        </CustomButton>
        <div className="absolute right-55 top-1/2 -translate-y-1/2">
          <ExternalLink
            strokeWidth={2}
            style={{ color: COLORS.icon.secondry }}
            className="w-5 h-5 "
          />
        </div>
      </div>

      <ClickToResend handleRestLink={fetchRequest} emailSended={email} />
    </div>
  );
}
