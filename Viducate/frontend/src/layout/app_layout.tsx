import { Outlet } from "react-router-dom";
import Navbar from "./nav_bar";
import { useAuth } from "../core/hooks/useAuth";

export function AppLayout() {
  const { user: userData, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col">
      {userData && <Navbar user={userData} onLogout={handleLogout} />}

      <main className="pt-11 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
