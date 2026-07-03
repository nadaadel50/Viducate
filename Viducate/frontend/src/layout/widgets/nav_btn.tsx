import { ChevronDown } from "lucide-react";

type NavbarUserButtonProps = {
  fullName: string;
  initials: string;
  dropdownOpen: boolean;
  onClick: () => void;
};

export function NavbarUserButton({
  fullName,
  initials,
  dropdownOpen,
  onClick,
}: NavbarUserButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-1.5 transition-colors hover:bg-gray-50"
      aria-expanded={dropdownOpen}
      aria-haspopup="true"
    >
      <span className="hidden text-sm text-gray-600 sm:block">{fullName}</span>

      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-xs font-medium text-indigo-600 ring-[1.5px] ring-indigo-200">
        {initials}
      </div>

      <ChevronDown
        size={13}
        className={`text-gray-400 transition-transform duration-200 ${
          dropdownOpen ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}
