import { useContext } from "react";
import { AuthContext } from "../../features/auth/presentation/context/auth_context";

export function useAuth() {
  const user = useContext(AuthContext);
  if (!user) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return user;
}
