import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../core/hooks/useAuth";
import { AppRoutesNames } from "./routes";


export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={AppRoutesNames.login} replace />;  //for example or landing page 
  }

  return <Outlet />;  // or outlet (will make it soon)
}