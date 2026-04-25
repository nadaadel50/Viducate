import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppRoutesNames } from "../../../../app/routers/routes";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {

    const hash = location.hash;

    if (hash) {
      
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get("access_token");

      if (token) {
        
        localStorage.setItem("token", token);
        console.log("Token saved successfully!");

        navigate(AppRoutesNames.uploadPage);//will change it to dashboard soon
      }
    }

    
    // console.error("No token found in URL hash");
    
  }, [location, navigate]);

  return null;
};

export default AuthSuccess;