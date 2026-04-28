import { Outlet } from "react-router-dom";

export function WatchLayout() {
  return (
    
      <div className="relative">
        <Outlet />
      </div>
    
  );
}