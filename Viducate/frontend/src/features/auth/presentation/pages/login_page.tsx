import { useIntl, FormattedMessage } from "react-intl";
import AuthLayout from "../layouts/auth_layout";
import { AuthForm } from "../componants/auth_form";
import LoginPhoto from "../../../../assets/Images/LoginPhoto.png";
import { RightSection } from "../componants/right_section";

const LoginPage = () => {
  const intl = useIntl();
  return (
    <AuthLayout
      RightContent={
        <RightSection
          animation={false}
          titleFirstPart={intl.formatMessage({ id: "login.hero.title1" })}
          titleColoredPart={intl.formatMessage({ id: "login.hero.title2" })}
          description={intl.formatMessage({ id: "login.hero.description" })}
          imgSrc={LoginPhoto}
        />
      }
      LeftContent={<AuthForm type="login" />}
      RightBadge={
        <div
          className="absolute -right-70 -bottom-70 flex min-w-[180px] animate-bounce items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-[#252836]"
          style={{ animationDuration: "3s" }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 p-1.5 text-green-600">
            <span className="material-symbols-outlined text-sm">
              check_circle
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900 dark:text-white">
              <FormattedMessage id="login.badge.title" />
            </p>
            <p className="text-[10px] text-gray-500">
              <FormattedMessage id="login.badge.subtitle" />
            </p>
          </div>
        </div>
      }
    />
  );
};

export default LoginPage;
