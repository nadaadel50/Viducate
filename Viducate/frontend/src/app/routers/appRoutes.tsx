import { BrowserRouter, Route, Routes } from "react-router";
import { ProtectedRoute } from "./protextedRoutes";
import App from "../../App";
import { ForgetPasswordPage } from "../../features/auth/presentation/forgetpass/pages/forget_passwrod_page";
import { EmailSendedPage } from "../../features/auth/presentation/forgetpass/pages/email_sended_page";
import { ResetPasswordPage } from "../../features/auth/presentation/forgetpass/pages/reset_password_page";
import { SuccessfullResetPage } from "../../features/auth/presentation/forgetpass/pages/successfull_rest_page";


export function AppRoutes() {
    return (
        <BrowserRouter>

        <Routes>


            /* here we will put all the public routes that don't need authentication to access them like landing page, signup */
            <Route path="/" element={<ForgetPasswordPage />} />  /* for example */

             <Route  element={<ProtectedRoute/>}>  // will prmove "/protected" soon
              /* here we will put all the protected routes that need authentication to access them */
             </Route>

             <Route path="/success-send-email" element={<EmailSendedPage />} />
             <Route path="/reset-password" element={<ResetPasswordPage />} />
             


                

        </Routes>
        
        </BrowserRouter>
    )
}