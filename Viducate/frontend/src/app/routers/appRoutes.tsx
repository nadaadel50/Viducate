import { BrowserRouter, Route, Routes } from "react-router";
import { ProtectedRoute } from "./protextedRoutes";
import App from "../../App";
import LoginPage from "../../features/auth/presentation/pages/login_page";
import SignupPage from "../../features/auth/presentation/pages/signup_page";
import AuthSuccess from "../../features/auth/presentation/pages/AuthSuccess";

export function AppRoutes() {
    return (
        <BrowserRouter>

        <Routes>
          <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/callback" element={<AuthSuccess />} />


            /* here we will put all the public routes that don't need authentication to access them like landing page, signup */
            <Route path="/" element={<App />} />  /* for example */

             <Route  element={<ProtectedRoute/>}>  // will prmove "/protected" soon
              /* here we will put all the protected routes that need authentication to access them */
             </Route>


                

        </Routes>
        
        </BrowserRouter>
    )
}