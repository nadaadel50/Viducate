import { Navigate } from "react-router-dom";
import { useAuth } from "../../core/hooks/useAuth";
import { AppRoutesNames } from "./routes";

export function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to={AppRoutesNames.dashboard} replace />;
  }

  return children;
}