import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../core/hooks/useAuth";
import { routes } from "./routes";


export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={routes.home} replace />;  //for example or landing page 
  }

  return <Outlet />;  // or outlet (will make it soon)
}