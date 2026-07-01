import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AppRoutesNames } from "./routes";
import { PublicRoute } from "./publicRoutes";

// Auth
import LoginPage from "../../features/auth/presentation/pages/login_page";
import SignupPage from "../../features/auth/presentation/pages/signup_page";
import AuthSuccess from "../../features/auth/presentation/pages/AuthSuccess";
import { ForgetPasswordPage } from "../../features/auth/presentation/pages/forget_passwrod_page";
import { EmailSendedPage } from "../../features/auth/presentation/pages/email_sended_page";
import { ResetPasswordPage } from "../../features/auth/presentation/pages/reset_password_page";
import { SuccessfullResetPage } from "../../features/auth/presentation/pages/successfull_rest_page";

// Dashboard
import { DashboardProvider } from "../../features/dashboard/presentaion/context/dashboard_provider";
import { DashboardPage } from "../../features/dashboard/presentaion/pages/dashboard_page";

// Upload
import { UploadVideoPage } from "../../features/video_upload/presentation/pages/upload_video_page";
import { ProcessingPage } from "../../features/video_upload/presentation/pages/processing_page";

// Profile
import { ProfileProvider } from "../../features/Profile/presentation/context/profile_provider";
import { ProfilePage } from "../../features/Profile/presentation/pages/profile_page";

// Report
import { ReportPage } from "../../features/report/presentation/pages/report_page";

// Mind Map
import MindMapPage from "../../features/mindMap/presentation/pages/mindMap_page";

// Quiz
import { QuizPage } from "../../features/QuizSystem/presentation/pages/quiz_page";

// Summary
import SummaryPage from "../../features/summarization/presentation/pages/summary_page";
import StudyNotesPage from "../../features/summarization/presentation/pages/study_notes_page";
import { GeneratingSummaryPage } from "../../features/summarization/presentation/pages/summary_generation_page";
import { GeneratingStudyNotesPage } from "../../features/summarization/presentation/pages/study_notes_generation_page";
import { AppLayout } from "../../layout/app_layout";
import { ProtectedRoute } from "./protextedRoutes";
import { WatchLayout } from "../../features/watch_video/presentation/pages/watch_outlet";
import  { FlashCards } from "../../features/flash_cards/presentation/pages/flash_card_page";
import { MainPage } from "../../features/watch_video/presentation/pages/main_page";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= AUTH ================= */}

        <Route
          path={AppRoutesNames.login}
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path={AppRoutesNames.signup}
          element={<SignupPage />}
        />

        <Route
          path={AppRoutesNames.authCallback}
          element={<AuthSuccess />}
        />

        <Route
          path={AppRoutesNames.forgotPassword}
          element={<ForgetPasswordPage />}
        />

        <Route
          path={AppRoutesNames.successSendEmail}
          element={<EmailSendedPage />}
        />

        <Route
          path={AppRoutesNames.resetPassword}
          element={<ResetPasswordPage />}
        />

        <Route
          path={AppRoutesNames.successResetPassword}
          element={<SuccessfullResetPage />}
        />

        {/* ================= APP ================= */}
       
  <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
       
          <Route
            path={AppRoutesNames.dashboard}
            element={
              <DashboardProvider>
                <DashboardPage />
              </DashboardProvider>
            }
          />

          <Route
            path={AppRoutesNames.profile}
            element={
              <ProfileProvider>
                <ProfilePage />
              </ProfileProvider>
            }
          />

          <Route
            path={AppRoutesNames.uploadVideo}
            element={<UploadVideoPage />}
          />

          <Route
            path={AppRoutesNames.processing}
            element={<ProcessingPage />}
          />

          <Route
            path={AppRoutesNames.report}
            element={<ReportPage />}
          />

          <Route
            path={AppRoutesNames.mindMap}
            element={<MindMapPage />}
          />

          {/* Quiz */}

          <Route
            path={`${AppRoutesNames.quiz}/:segmentId`}
            element={<QuizPage />}
          />

          <Route
            path={`${AppRoutesNames.quizByVideo}/:videoId`}
            element={<QuizPage />}
          />

          {/* Summary */}

          <Route
            path={`${AppRoutesNames.summary}/:segmentId`}
            element={<SummaryPage />}
          />

          <Route
            path={`${AppRoutesNames.summaryByVideo}/:videoId`}
            element={<SummaryPage />}
          />

          <Route
            path={AppRoutesNames.generatingSummary}
            element={<GeneratingSummaryPage />}
          />

          {/* Study Notes */}

          <Route
            path={AppRoutesNames.studyNotes}
            element={<StudyNotesPage />}
          />

          <Route
            path={`${AppRoutesNames.studyNotes}/:segmentId`}
            element={<StudyNotesPage />}
          />

          <Route
            path={`${AppRoutesNames.studyNotesByVideo}/:videoId`}
            element={<StudyNotesPage />}
          />

          <Route
            path={AppRoutesNames.generatingStudyNotes}
            element={<GeneratingStudyNotesPage />}
          />

          {/* Watch */}

          <Route
            path={AppRoutesNames.watchVideo}
            element={<WatchLayout />}
          >
            <Route
              index
              element={<MainPage />}
            />

            <Route
              path={`${AppRoutesNames.flashCards}/:segmentId`}
              element={<FlashCards />}
            />

            <Route
              path={AppRoutesNames.flashCards}
              element={<FlashCards />}
            />
          </Route>
        </Route>
      </Route>
    </Routes>
      
    </BrowserRouter>
  );
}