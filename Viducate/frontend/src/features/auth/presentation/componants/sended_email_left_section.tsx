import { ExternalLink, Mail } from "lucide-react";
import { COLORS } from "../../../../core/constants";
import { MainText } from "../../../../core/componants/text_section";
import { CustomButton } from "../../../../core/componants/custum_btn";
import { ClickToResend } from "./click_to_resend";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { useForgetPassword } from "../hooks/use_forget_password";

export function SendedEmailLeftSection() {
  const intl = useIntl();
  const location = useLocation();
  const email = location.state?.email;
  const { fetchRequest } = useForgetPassword();

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      <div
        style={{ background: COLORS.icon.background }}
        className="flex justify-center items-center w-16 h-16 md:w-18 md:h-18 rounded-2xl"
      >
        <Mail
          strokeWidth={2}
          style={{ color: COLORS.icon.primary }}
          className="w-8 h-8 md:w-9 md:h-9"
        />
      </div>

      <div className="mt-4 mb-6 flex flex-col items-center text-center">
        <MainText
          bigTitle={intl.formatMessage({ id: "auth.checkEmail.title" })}
          smallTitle={intl.formatMessage({ id: "auth.checkEmail.subtitle" })}
        />

        <p className="mt-2 text-sm md:text-base break-all">{email}</p>
      </div>

      <div
        onClick={() => {
          window.open("https://mail.google.com", "_blank");
        }}
        className="w-full"
      >
        <div className="relative">
          <CustomButton>
            <span className="flex items-center justify-center gap-2">
              {intl.formatMessage({
                id: "auth.checkEmail.openEmailApp",
              })}

              <ExternalLink
                strokeWidth={2}
                style={{ color: COLORS.icon.secondry }}
                className="w-4 h-4"
              />
            </span>
          </CustomButton>
        </div>
      </div>

      <div className="mt-5">
        <ClickToResend handleRestLink={fetchRequest} emailSended={email} />
      </div>
    </div>
  );
}
