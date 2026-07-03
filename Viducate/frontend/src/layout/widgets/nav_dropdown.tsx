import { LogOut, Settings } from "lucide-react";
import { AppRoutesNames } from "../../app/routers/routes";
import { FormattedMessage } from "react-intl";
import { SafeNavLink } from "../hooks/save_nav_link";
type NavbarDropdownProps = {
  fullName: string;
  email: string;
  onLogout: () => void;
  closeDropdown: () => void;
};

export function NavbarDropdown({
  fullName,
  email,
  onLogout,
  closeDropdown,
}: NavbarDropdownProps) {
  return (
    <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-100 bg-white py-1.5 shadow-lg">
      <div className="mb-1 border-b border-gray-100 px-3 py-2.5">
        <p className="text-sm font-medium text-gray-800">{fullName}</p>

        <p className="mt-0.5 text-xs text-gray-400">{email}</p>
      </div>

      <SafeNavLink
        to={AppRoutesNames.profile}
        onBeforeNavigate={closeDropdown}
        className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
      >
        <Settings size={14} className="text-gray-400" />
        <FormattedMessage id="navbar.profileSettings" />
      </SafeNavLink>

      <div className="my-1 border-t border-gray-100" />

      <SafeNavLink
        onBeforeNavigate={() => {
          closeDropdown();
          onLogout();
        }}
        className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-50"
      >
        <LogOut size={14} />
        <FormattedMessage id="navbar.logout" />
      </SafeNavLink>
    </div>
  );
}
