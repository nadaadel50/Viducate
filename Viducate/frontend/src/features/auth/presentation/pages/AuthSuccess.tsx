import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppRoutesNames } from "../../../../app/routers/routes";
import { useAuth } from "../../../../core/hooks/useAuth";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser } = useAuth();
  useEffect(() => {
    const handleAuth = async () => {
      const hash = location.hash;

      if (!hash) return;

      const params = new URLSearchParams(hash.substring(1));
      const token = params.get("access_token");

      if (!token) return;

      localStorage.setItem("token", token);

      await refreshUser();

      navigate(AppRoutesNames.dashboard, { replace: true });
    };

    handleAuth();
  }, [location, navigate, refreshUser]);

  return null;
};

export default AuthSuccess;
