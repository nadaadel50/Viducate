import { useLocation, useNavigate, Outlet } from "react-router";
import { MainPage } from "./main_page";

export function WatchLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isOverlay = pathname.includes("/WatchVideo/");

  return (
    <div >
      <div
        className={`transition-all duration-300 ${
          isOverlay
            ? "blur-sm brightness-75 pointer-events-none select-none"
            : ""
        }`}
      >
        <MainPage />
      </div>

      {isOverlay && (
        <div
          onClick={() => navigate(-1)}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        >
          <div
            className="w-full max-w-3xl flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
}