import { Outlet } from "react-router-dom";
import Navbar from "./nav_bar";
import { useAuth } from "../core/hooks/useAuth";

export function AppLayout() {
  const { user: userData,logout } = useAuth();

  const handleLogout = () => {
    logout()
  };

  return (
    <div className="min-h-screen bg-white">
      {userData && (
        <Navbar
          user={userData}
          onLogout={handleLogout}
        />
      )}

      <main className="pt-12">
        <Outlet />
      </main>
    </div>
  );
}