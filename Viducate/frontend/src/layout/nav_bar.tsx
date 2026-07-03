import { useNavbar } from "./hooks/use_navbar";
import type { User } from "../features/auth/domain/entity/user";
import { NavbarUserButton } from "./widgets/nav_btn";
import { NavbarDropdown } from "./widgets/nav_dropdown";
import { NavbarLeft } from "./widgets/nav_left";

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const {
    dropdownOpen,
    setDropdownOpen,
    dropdownRef,
    isDashboard,
    fullName,
    initials,
  } = useNavbar(user);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-11 border-b border-gray-100 bg-white font-display">
      <div className="mx-5 flex h-full items-center justify-between">
        <NavbarLeft isDashboard={isDashboard} />

        <div ref={dropdownRef} className="relative">
          <NavbarUserButton
            fullName={fullName}
            initials={initials}
            dropdownOpen={dropdownOpen}
            onClick={() => setDropdownOpen((prev) => !prev)}
          />

          {dropdownOpen && (
            <NavbarDropdown
              fullName={fullName}
              email={user.email}
              onLogout={onLogout}
              closeDropdown={() => setDropdownOpen(false)}
            />
          )}
        </div>
      </div>
    </header>
  );
}
