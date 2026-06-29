import { LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../core/componants/logo";

type NavbarLeftProps = {
  isDashboard: boolean;
};

export function NavbarLeft({ isDashboard }: NavbarLeftProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-6">
      <Logo />

      <div className="h-4 w-px bg-gray-200" />

      <button
        onClick={() => navigate("/dashboard")}
        className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
          isDashboard
            ? "bg-indigo-50 font-medium text-indigo-600"
            : "font-normal text-gray-500 hover:bg-gray-50 hover:text-gray-800"
        }`}
      >
        <LayoutDashboard size={15} />
        Dashboard
      </button>
    </div>
  );
}