import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../core/hooks/useAuth";
import { AppRoutesNames } from "./routes";


export function ProtectedRoute() {
const { isAuthenticated, loading } = useAuth();

if (loading) return null;

if (!isAuthenticated) {
  return <Navigate to={AppRoutesNames.login} replace />;
}


  return <Outlet />;  
}