import { LayoutDashboard } from "lucide-react";
import { Logo } from "../../core/componants/logo";
import { AppRoutesNames } from "../../app/routers/routes";
import { FormattedMessage } from "react-intl";
import { SafeNavLink } from "../hooks/save_nav_link";
type NavbarLeftProps = {
  isDashboard: boolean;
};

export function NavbarLeft({ isDashboard }: NavbarLeftProps) {
  return (
    <div className="flex items-center gap-6">
      <Logo />

      <div className="h-4 w-px bg-gray-200" />

      <SafeNavLink
        to={AppRoutesNames.dashboard}
        className={` flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
          isDashboard
            ? "bg-indigo-50 font-medium text-indigo-600"
            : "font-normal text-gray-500 hover:bg-gray-50 hover:text-gray-800"
        }`}
      >
        <LayoutDashboard size={15} />
        <FormattedMessage id="navbar.dashboard" />
      </SafeNavLink>
    </div>
  );
}
