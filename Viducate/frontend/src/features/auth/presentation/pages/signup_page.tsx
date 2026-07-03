import React from "react";
import { useIntl, FormattedMessage } from "react-intl";
import AuthLayout from "../layouts/auth_layout";
import { AuthForm } from "../componants/auth_form";
import { RightSection } from "../componants/right_section";
import signUpPhoto from "../../../../assets/Images/signUpPhoto.jpeg";

const SignupPage: React.FC = () => {
  const intl = useIntl();

  return (
    <AuthLayout
      RightContent={
        <RightSection
          animation={false}
          titleFirstPart={intl.formatMessage({ id: "signup.hero.title1" })}
          titleColoredPart={intl.formatMessage({ id: "signup.hero.title2" })}
          description={intl.formatMessage({ id: "signup.hero.description" })}
          imgSrc={signUpPhoto}
        />
      }
      LeftContent={<AuthForm type="signup" />}
      RightBadge={
        <div
          className="absolute -right-70 -top-0 flex min-w-[180px] animate-bounce items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-[#252836]"
          style={{ animationDuration: "3s" }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 p-1.5 text-green-600">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              <FormattedMessage id="signup.badge.title" />
            </p>
            <p className="text-lg font-bold text-[#111218] dark:text-white">
              <FormattedMessage id="signup.badge.score" />
            </p>
          </div>
        </div>
      }
    />
  );
};

export default SignupPage;
