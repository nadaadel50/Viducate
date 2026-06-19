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
import { GeneratingSummaryPage } from "../../features/summarization/presentation/pages/GeneratingSummaryPage";
import { GeneratingStudyNotesPage } from "../../features/summarization/presentation/pages/GeneratingStudyNotesPage";
import SummaryPage from "../../features/summarization/presentation/pages/SummaryPage";
import StudyNotesPage from "../../features/summarization/presentation/pages/StudyNotesPage";
import {QuizPage} from "../../features/QuizSystem/presentation/pages/QuizPage";
import {ReportPage} from "../../features/report/presentation/pages/report_page";
import { FlashCards } from "../../features/flash_cards/presentation/pages/flash_card_page";
import { WatchLayout } from "../../features/watch_video/presentation/pages/watch_outlet";
import { PublicRoute } from "./publicRoutes";
import MindMapPage from "../../features/mindMap/presentation/pages/mindMap_page";
import{ProfilePage} from "../../features/Profile/presentation/pages/profile_page";
import { ProfileProvider } from "../../features/Profile/presentation/context/profile_provider";
import { DashboardProvider } from "../../features/dashboard/presentaion/context/dashboard_provider";
import { DashboardPage } from "../../features/dashboard/presentaion/pages/dashboard_page";
export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        {/* <Route path="/" element={<FlashCards />} />{" "} */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/callback" element={<AuthSuccess />} />
        <Route path="/forgot-password" element={<ForgetPasswordPage />} />
      

        
        <Route path="/report" element={<ReportPage />} />
        
        <Route path="/test-modals" element={<TestModalsPage />} /> {/* for testing */}
        <Route path="/profile" element={
          <ProfileProvider>
            <ProfilePage />
          </ProfileProvider>
        } />
        <Route path="/study-notes" element={<StudyNotesPage />} />
        <Route element={<ProtectedRoute />}>
          {" "}
          <Route path="/UploadVideoPage" element={<UploadVideoPage />} />
          <Route path="/ProcessingPage" element={<ProcessingPage />} />
          <Route path={AppRoutesNames.mindMap} element={<MindMapPage />} />
          <Route path="/quiz/:segmentId" element={<QuizPage />} />
          <Route path="/quiz/video/:videoId" element={<QuizPage />} />
          <Route path="/summary/:segmentId" element={<SummaryPage />} />
          <Route path="/summary/video/:videoId" element={<SummaryPage />} />
          <Route
            path="/generating-summary"
            element={<GeneratingSummaryPage />}
          />
          <Route path="/study-notes/:segmentId" element={<StudyNotesPage />} />
          <Route
            path="/study-notes/video/:videoId"
            element={<StudyNotesPage />}
          />
          <Route
            path="/generating-study-notes"
            element={<GeneratingStudyNotesPage />}
          />
          <Route
            path={AppRoutesNames.dashboard}
            element={
              <DashboardProvider>
                <DashboardPage />
              </DashboardProvider>
            }
          />
          <Route path="/WatchVideo" element={<WatchLayout />}>
            <Route index element={<MainPage />} /> {/* /WatchVideo */}
            <Route path="flashcards/:segmentId" element={<FlashCards />} />{" "}
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
