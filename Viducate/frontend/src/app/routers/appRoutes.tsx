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
import { GeneratingSummaryPage } from '../../features/summarization/presentation/pages/GeneratingSummaryPage';
import SummaryPage from "../../features/summarization/presentation/pages/SummaryPage";
import StudyNotesPage from "../../features/summarization/presentation/pages/StudyNotesPage";
import {QuizPage} from "../../features/QuizSystem/presentation/pages/QuizPage";

import { FlashCards } from "../../features/flash_cards/presentation/pages/flash_card_page";
import { WatchLayout } from "../../features/watch_video/presentation/pages/watch_outlet";
export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
         {/* <Route path="/" element={<FlashCards />} />{" "} */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/callback" element={<AuthSuccess />} />
        <Route path="/forgot-password" element={<ForgetPasswordPage />} />

        <Route path="/test-modals" element={<TestModalsPage />} /> /* for
        <Route path="/generating-summary" element={<GeneratingSummaryPage />} />
        <Route path="/summary" element={<SummaryPage />} />
        <Route path="/study-notes" element={<StudyNotesPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route element={<ProtectedRoute />}>
          {" "}
          <Route path="/UploadVideoPage" element={<UploadVideoPage />} />
          <Route path="/ProcessingPage" element={<ProcessingPage />} />
          {/* <Route path="/WatchVideo" element={<MainPage />} />
          <Route path="/flashcards/:segmentId" element={<FlashCards />} /> */}
       
          <Route path="/WatchVideo" element={<WatchLayout />}>
            <Route index element={<MainPage />} /> {/* /WatchVideo */}
            <Route path="flashcards/:segmentId" element={<FlashCards />} />
            {" "}
            {/* /WatchVideo/flashcards */}
          </Route>{" "}
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
