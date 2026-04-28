import { BrowserRouter, Route, Routes } from "react-router";
import { ProtectedRoute } from "./protextedRoutes";

import { UploadVideoPage } from "../../features/video_upload/presentation/pages/upload_video_page";
import { ForgetPasswordPage } from "../../features/auth/presentation/forgetpass/pages/forget_passwrod_page";
import { EmailSendedPage } from "../../features/auth/presentation/forgetpass/pages/email_sended_page";
import { ResetPasswordPage } from "../../features/auth/presentation/forgetpass/pages/reset_password_page";
import { SuccessfullResetPage } from "../../features/auth/presentation/forgetpass/pages/successfull_rest_page";
import { AppRoutesNames } from "./routes";

import LoginPage from "../../features/auth/presentation/pages/login_page";
import SignupPage from "../../features/auth/presentation/pages/signup_page";

import { MainPage } from "../../features/watch_video/presentation/pages/main_page";


import TestModalsPage from "../../features/video_upload/presentation/pages/test_modals_page";
import { ProcessingPage } from "../../features/video_upload/presentation/pages/processing_page";
import AuthSuccess from "../../features/auth/presentation/pages/AuthSuccess";
export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/callback" element={<AuthSuccess />} />
        <Route path="/forgot-password" element={<ForgetPasswordPage />} />
        <Route path="/" element={<ForgetPasswordPage />} /> /* for example */
        <Route path="/test-modals" element={<TestModalsPage />} /> /* for
        <Route element={<ProtectedRoute />}>
          {" "}
        
          <Route path="/UploadVideoPage" element={<UploadVideoPage />} />
          <Route path="/ProcessingPage" element={<ProcessingPage />} />
          <Route
            path="/WatchVideo"
            element={
              
                <MainPage />
             
            }
          />{" "}
        </Route>
        <Route
          path={AppRoutesNames.sucessSendEmail}
          element={<EmailSendedPage />}
        />
        <Route path={AppRoutesNames.restPass} element={<ResetPasswordPage />} />
        <Route
          path={AppRoutesNames.successRestPass}
          element={<SuccessfullResetPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}
