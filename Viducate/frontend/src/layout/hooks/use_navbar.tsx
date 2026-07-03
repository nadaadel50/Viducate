import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import type { User } from "../../features/auth/domain/entity/user";
import { getInitials } from "../../core/utils/format_name";

export function useNavbar(user: User) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const location = useLocation();

  const isDashboard = location.pathname === "/dashboard";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fullName = `${user.first_name} ${user.last_name}`;

  const initials = getInitials(fullName);
  return {
    dropdownOpen,
    setDropdownOpen,
    dropdownRef,
    isDashboard,
    fullName,
    initials,
  };
}
