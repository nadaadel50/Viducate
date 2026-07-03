export type MasteryLevel = "weak" | "developing" | "strong" | "mastered";

export type MaterialsGenerated = {
  summary: boolean;
  studyNotes: boolean;
  quiz: boolean;
  flashcards: number;
};

export type TopicReport = {
  id: string;
  title: string;
  quizScore: number;
  masteryLevel: string;
  correctAnswers: number;
  quizTotal: number;
  quizAttempts: number;
  weakAreas: string[];
  materialsGenerated: MaterialsGenerated;
};

export type VideoReport = {
  videoId: number;
  title: string;
  updatedAt: string;
  overallScore: number;
  correctAnswers: number;
  totalQuizQuestions: number;
  hasSummary: boolean;
  hasStudyNotes: boolean;
  hasComprehensiveQuiz: boolean;
  totalFlashcards: number;
  strongTopics: string[];
  weakTopics: string[];
  topics: TopicReport[];
};
