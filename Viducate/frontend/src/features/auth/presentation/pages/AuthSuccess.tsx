import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

        navigate("/dashboard");
        return;
      }
    }


    console.error("No token found in URL hash");
    
  }, [location, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>جاري فك تشفير البيانات وتسجيل الدخول...</h2>
    </div>
  );
};

export default AuthSuccess;