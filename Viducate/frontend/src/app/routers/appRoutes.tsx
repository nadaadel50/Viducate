import { BrowserRouter, Route, Routes } from "react-router";
import { ProtectedRoute } from "./protextedRoutes";
import App from "../../App";
import { ForgetPasswordPage } from "../../features/auth/presentation/forgetpass/pages/forget_passwrod_page";
import { EmailSendedPage } from "../../features/auth/presentation/forgetpass/pages/email_sended_page";
import { ResetPasswordPage } from "../../features/auth/presentation/forgetpass/pages/reset_password_page";
import { SuccessfullResetPage } from "../../features/auth/presentation/forgetpass/pages/successfull_rest_page";
import { AppRoutesNames } from "./routes";

import LoginPage from "../../features/auth/presentation/pages/login_page";
import SignupPage from "../../features/auth/presentation/pages/signup_page";


export function AppRoutes() {
    return (
        <BrowserRouter>

        <Routes>
          <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* <Route path="/auth/callback" element={<AuthSuccess />} /> */}
        <Route path="/forgot-password" element={<ForgetPasswordPage />} />


            /* here we will put all the public routes that don't need authentication to access them like landing page, signup */
           /* for example */

             <Route  element={<ProtectedRoute/>}>  // will prmove "/protected" soon
              /* here we will put all the protected routes that need authentication to access them */
             </Route>

             <Route path={AppRoutesNames.sucessSendEmail} element={<EmailSendedPage />} />
             <Route path={AppRoutesNames.restPass} element={<ResetPasswordPage />} />
             <Route path={AppRoutesNames.successRestPass} element={<SuccessfullResetPage />} />
             


                

        </Routes>
        
        </BrowserRouter>
    )
}