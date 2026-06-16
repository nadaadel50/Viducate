
export type TopicStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed_pending_quiz'
  | 'completed_with_quiz';

export type MasteryLevel = 'weak' | 'developing' | 'strong' | 'mastered';

export interface TopicMaterials {
  summary: boolean;
  studyNotes: boolean;
  quiz: boolean;
  flashcards: number;
}

export interface TopicReport {
  id: string;
  title: string;
  status: TopicStatus;
  progressPercent: number;
  masteryLevel?: MasteryLevel;
  quizScore?: number;
  quizTotal?: number;
  quizAttempts?: number;
  weakAreas?: string[];
  materialsGenerated: TopicMaterials;
}

export interface VideoReport {
  thumbnail?: string;
  title: string;
  totalDuration: string;
  watchedDuration: string;
  completionPercent: number;
  lastStudied: string;
  uploadedAt: string;
  overallScore: number;
  correctAnswers: number;
  totalQuizQuestions: number;
  hasSummary: boolean;
  hasStudyNotes: boolean;
  hasComprehensiveQuiz: boolean;
  totalFlashcards: number;
  flashcardsReviewed: number;
  strongTopics: string[];
  weakTopics: string[];
  topics: TopicReport[];
}

// --- Mock Data ---
export const mockReport: VideoReport = {
  title: 'Introduction to Advanced Machine Learning Algorithms',
  totalDuration: '1h 45m',
  watchedDuration: '1h 10m',
  completionPercent: 66,
  lastStudied: 'Today',
  uploadedAt: 'Oct 12, 2023',
  overallScore: 82,
  correctAnswers: 24,
  totalQuizQuestions: 30,
  hasSummary: true,
  hasStudyNotes: true,
  hasComprehensiveQuiz: true,
  totalFlashcards: 60,
  flashcardsReviewed: 45,
  strongTopics: ['Neural Networks', 'Gradient Descent'],
  weakTopics: ['Backpropagation'],
  topics: [
    {
      id: 't1',
      title: 'Neural Networks Basics',
      status: 'completed_with_quiz',
      progressPercent: 100,
      masteryLevel: 'mastered',
      quizScore: 5,
      quizTotal: 5,
      quizAttempts: 1,
      weakAreas: [],
      materialsGenerated: { summary: true, studyNotes: true, quiz: true, flashcards: 12 },
    },
    {
      id: 't2',
      title: 'Gradient Descent Optimization',
      status: 'completed_with_quiz',
      progressPercent: 100,
      masteryLevel: 'strong',
      quizScore: 4,
      quizTotal: 5,
      quizAttempts: 2,
      weakAreas: [],
      materialsGenerated: { summary: true, studyNotes: true, quiz: true, flashcards: 10 },
    },
    {
      id: 't3',
      title: 'Backpropagation Algorithm',
      status: 'completed_pending_quiz',
      progressPercent: 100,
      quizAttempts: 0,
      materialsGenerated: { summary: true, studyNotes: true, quiz: true, flashcards: 10 },
    },
    {
      id: 't6',
      title: 'Hyperparameter Tuning',
      status: 'completed_with_quiz',
      progressPercent: 100,
      masteryLevel: 'weak',
      quizScore: 2,
      quizTotal: 5,
      quizAttempts: 3,
      weakAreas: ['Learning Rate Schedules', 'Batch Size Impact', 'Grid Search Limitations'],
      materialsGenerated: { summary: true, studyNotes: true, quiz: true, flashcards: 8 },
    },
  ],
};

// --- Config Maps ---
export interface StatusConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
  emoji: string;
}

export const STATUS_CONFIG: Record<Exclude<TopicStatus, 'completed_with_quiz'>, StatusConfig> = {
  not_started:            { label: 'Not Started', color: '#94a3b8', bg: '#f8fafc', border: '#e2e8f0', emoji: '💤' },
  in_progress:            { label: 'In Progress', color: '#d97706', bg: '#fffbeb', border: '#fde68a', emoji: '⏳' },
  completed_pending_quiz: { label: 'Needs Quiz',  color: '#7c3aed', bg: '#f3e8ff', border: '#e9d5ff', emoji: '📝' },
};

export const MASTERY_CONFIG: Record<MasteryLevel, StatusConfig> = {
  weak:      { label: 'Needs Work', color: '#e11d48', bg: '#fff1f2', border: '#fecdd3', emoji: '🔴' },
  developing:{ label: 'Developing', color: '#d97706', bg: '#fffbeb', border: '#fde68a', emoji: '🟡' },
  strong:    { label: 'Strong',     color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', emoji: '🟢' },
  mastered:  { label: 'Mastered',   color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', emoji: '🏆' },
};

export function getTopicCardConfig(topic: TopicReport): StatusConfig {
  if (topic.status === 'completed_with_quiz' && topic.masteryLevel) {
    return MASTERY_CONFIG[topic.masteryLevel];
  }
  return STATUS_CONFIG[topic.status as Exclude<TopicStatus, 'completed_with_quiz'>];
}
// export const mockReport2: VideoReport = {
//   title: 'Introduction to Advanced Machine Learning Algorithms',
//   updatedAt: 'Oct 12, 2023',
//   overallScoreinVideo: 82,
//   correctAnswers: 24,
//   totalQuizQuestions: 30,
//   hasSummary: true,
//   hasStudyNotes: true,
//   hasComprehensiveQuiz: true,
//   totalFlashcardsGenerated: 60,
//   strongTopics: ['Neural Networks', 'Gradient Descent'],
//   weakTopics: ['Backpropagation'],
//   topics: [
//     {
//       id: 't1',
//       title: 'Neural Networks Basics',
//       quizScore: 100,
//       masteryLevel: 'mastered',
//       correctAnswers: 5,
//       quizTotal: 5,
//       quizAttempts: 1,
//       weakAreas: [],
//       materialsGenerated: { summary: true, studyNotes: true, quiz: true, flashcards: 12 },
//     },
//     {
//       id: 't2',
//       title: 'Gradient Descent Optimization',
//       quizScore: 80,
//       masteryLevel: 'strong',
//       correctAnswers: 4,
//       quizTotal: 5,
//       quizAttempts: 2,
//       weakAreas: [],
//       materialsGenerated: { summary: true, studyNotes: false, quiz: true, flashcards: 10 },
//     },
//     {
//       id: 't3',
//       title: 'Backpropagation Algorithm',
//       masteryLevel: 'needs_quiz',
//       quizScore: 0,
//       quizAttempts: 0,
//       materialsGenerated: { summary: true, studyNotes: true, quiz: true, flashcards: 10 },
//     },
//     {
//       id: 't6',
//       title: 'Hyperparameter Tuning',
//       quizScore: 100,
//       masteryLevel: 'weak',
//       correctAnswers: 2,
//       quizTotal: 5,
//       quizAttempts: 3,
//       weakAreas: ['Learning Rate Schedules', 'Batch Size Impact', 'Grid Search Limitations'],
//       materialsGenerated: { summary: true, studyNotes: true, quiz: true, flashcards: 8 },
//     },
//   ],
// };
