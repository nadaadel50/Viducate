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
import { SelectedTopicProvider } from "../../features/watch_video/presentation/context/topic_provider";

import TestModalsPage from "../../features/video_upload/presentation/pages/test_modals_page";
import { ProcessingPage } from "../../features/video_upload/presentation/pages/processing_page";
import AuthSuccess from "../../features/auth/presentation/pages/AuthSuccess";
import { FlashCards } from "../../features/flash_cards/presentation/pages/flash_card_page";
export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<LoginPage />} /> */}


          <Route path="/" element={<FlashCards />} /> 

          
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/callback" element={<AuthSuccess />} />
       
        /* here we will put all the public routes that don't need authentication
        to access them like landing page, signup */ /* for example */ /* for
        example */
        <Route path={AppRoutesNames.forgotPassword} element={<ForgetPasswordPage />} /> /* for example */
        <Route path="/test-modals" element={<TestModalsPage />} /> /* for
        example */
        <Route element={<ProtectedRoute />}>
          {" "}
          // will prmove "/protected" soon /* here we will put all the protected
          routes that need authentication to access them */
          <Route path="/UploadVideoPage" element={<UploadVideoPage />} />
           {/* <Route path={AppRoutesNames.flashCards} element={<FlashCards />} /> */}
          
          <Route path="/ProcessingPage/:videoId" element={<ProcessingPage />} />
          <Route
            path="/WatchVideo"
            element={
              <SelectedTopicProvider>
                <MainPage />
              </SelectedTopicProvider>
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
