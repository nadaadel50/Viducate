import { Navigate } from "react-router-dom";
import { AppRoutesNames } from "./routes";

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to={AppRoutesNames.uploadPage} replace />;
  }

  return children;
}