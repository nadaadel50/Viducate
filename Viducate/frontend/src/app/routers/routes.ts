export const AppRoutesNames = {
  // Auth
  login: "/",
  signup: "/signup",
  authCallback: "/auth/callback",
  forgotPassword: "/forgot-password",
  successSendEmail: "/sended-email",
  resetPassword: "/reset-password",
  successResetPassword: "/success-reset-password",

  // Dashboard
  dashboard: "/dashboard",
  profile: "/profile",

  // Upload
  uploadVideo: "/UploadVideoPage",
  processing: "/ProcessingPage",

  // Watch
  watchVideo: "/WatchVideo",
  flashCards: "flashcards",

  // Quiz
  quiz: "/quiz",
  quizByVideo: "/quiz/video",

  // Summary
  summary: "/summary",
  summaryByVideo: "/summary/video",
  generatingSummary: "/generating-summary",

  // Study Notes
  studyNotes: "/study-notes",
  studyNotesByVideo: "/study-notes/video",
  generatingStudyNotes: "/generating-study-notes",

  // Report
  report: "/report",

  // Mind Map
  mindMap: "/MindMap",
} as const;