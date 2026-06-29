import { BrowserRouter, Route, Routes } from "react-router";


import { AppRoutesNames } from "./routes";
import { PublicRoute } from "./publicRoutes";

// Auth
import LoginPage from "../../features/auth/presentation/pages/login_page";
import SignupPage from "../../features/auth/presentation/pages/signup_page";
import { ForgetPasswordPage } from "../../features/auth/presentation/pages/forget_passwrod_page";
import { EmailSendedPage } from "../../features/auth/presentation/pages/email_sended_page";
import { ResetPasswordPage } from "../../features/auth/presentation/pages/reset_password_page";
import { SuccessfullResetPage } from "../../features/auth/presentation/pages/successfull_rest_page";
import AuthSuccess from "../../features/auth/presentation/pages/AuthSuccess";

// Dashboard
import { DashboardPage } from "../../features/dashboard/presentaion/pages/dashboard_page";
import { DashboardProvider } from "../../features/dashboard/presentaion/context/dashboard_provider";

// Upload
import { UploadVideoPage } from "../../features/video_upload/presentation/pages/upload_video_page";
import { ProcessingPage } from "../../features/video_upload/presentation/pages/processing_page";

// Watch
import { WatchLayout } from "../../features/watch_video/presentation/pages/watch_outlet";
import { MainPage } from "../../features/watch_video/presentation/pages/main_page";

// Quiz
import { QuizPage } from "../../features/QuizSystem/presentation/pages/quiz_page";

// Flash Cards
import { FlashCards } from "../../features/flash_cards/presentation/pages/flash_card_page";

// Report
import { ReportPage } from "../../features/report/presentation/pages/report_page";

// Mind Map
import MindMapPage from "../../features/mindMap/presentation/pages/mindMap_page";

// Profile
import { ProfileProvider } from "../../features/Profile/presentation/context/profile_provider";
import { ProfilePage } from "../../features/Profile/presentation/pages/profile_page";

// Summary
import SummaryPage from "../../features/summarization/presentation/pages/summary_page";
import StudyNotesPage from "../../features/summarization/presentation/pages/study_notes_page";
import { GeneratingSummaryPage } from "../../features/summarization/presentation/pages/summary_generation_page";
import { GeneratingStudyNotesPage } from "../../features/summarization/presentation/pages/study_notes_generation_page";
import { AppLayout } from "../../layout/app_layout";
import { ProtectedRoute } from "./protextedRoutes";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= AUTH ================= */}

        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/callback" element={<AuthSuccess />} />
        <Route path="/forgot-password" element={<ForgetPasswordPage />} />

        <Route
          path={AppRoutesNames.sucessSendEmail}
          element={<EmailSendedPage />}
        />

        <Route
          path={AppRoutesNames.restPass}
          element={<ResetPasswordPage />}
        />

        <Route
          path={AppRoutesNames.successRestPass}
          element={<SuccessfullResetPage />}
        />

        {/* ================= APP ================= */}
        <Route element={<ProtectedRoute />}>

        <Route element={<AppLayout />}>
          <Route path="/report" element={<ReportPage />} />

          <Route
            path="/profile"
            element={
              <ProfileProvider>
                <ProfilePage />
              </ProfileProvider>
            }
          />

          <Route path="/UploadVideoPage" element={<UploadVideoPage />} />

          <Route path="/ProcessingPage" element={<ProcessingPage />} />

          <Route
            path={AppRoutesNames.dashboard}
            element={
              <DashboardProvider>
                <DashboardPage />
              </DashboardProvider>
            }
          />

          <Route
            path={AppRoutesNames.mindMap}
            element={<MindMapPage />}
          />

          {/* Quiz */}
          <Route path="/quiz/:segmentId" element={<QuizPage />} />
          <Route path="/quiz/video/:videoId" element={<QuizPage />} />

          {/* Summary */}
          <Route path="/summary/:segmentId" element={<SummaryPage />} />
          <Route path="/summary/video/:videoId" element={<SummaryPage />} />

          <Route
            path="/generating-summary"
            element={<GeneratingSummaryPage />}
          />

          {/* Study Notes */}
          <Route path="/study-notes" element={<StudyNotesPage />} />

          <Route
            path="/study-notes/:segmentId"
            element={<StudyNotesPage />}
          />

          <Route
            path="/study-notes/video/:videoId"
            element={<StudyNotesPage />}
          />

          <Route
            path="/generating-study-notes"
            element={<GeneratingStudyNotesPage />}
          />

          {/* Watch */}
          <Route path="/WatchVideo" element={<WatchLayout />}>
            <Route index element={<MainPage />} />
            <Route
              path="flashcards/:segmentId"
              element={<FlashCards />}
            />
            <Route
              path="flashcards"
              element={<FlashCards />}
            />
          </Route>
        </Route>
      </Route>
    </Routes>
      
    </BrowserRouter>
  );
}