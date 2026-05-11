import { useState } from 'react';
import { QuizDifficultyModal } from '../componants/QuizDifficultyModal';
import { GeneratingQuizPage } from './GeneratingQuizPage';
import { QuizPage } from './QuizPage';
import { QuizEntity } from '../../domain/entity/quiz_entity';
import { useGenerateQuiz } from '../hooks/useGenerateQuiz';
import  { useLearningSession } from '../../../../core/hooks/useLearningContent'; // عدّل الـ path

type FlowStep = 'difficulty' | 'generating' | 'quiz';

interface QuizFlowControllerProps {
  isOpen: boolean;
  onClose: () => void;
  segmentId?: number; 
}

export const QuizFlowController = ({ isOpen, onClose, segmentId }: QuizFlowControllerProps) => {
  const { videoId } = useLearningSession();
  const [step, setStep] = useState<FlowStep>('difficulty');
  const [quiz, setQuiz] = useState<QuizEntity | null>(null);

  const QUIZ_TIME = {
  video: 15,
  segment: 5,
} as const;

  const { generate } = useGenerateQuiz({
    videoId: videoId!,
    segmentId,
    mode: segmentId ? 'segment' : 'video',
    onSuccess: (data) => {
      setQuiz(data);
      setStep('quiz');
    },
  });

  const handleSelectDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    setStep('generating');
    generate(difficulty);
  };

  const handleReset = () => {
    setQuiz(null);
    setStep('difficulty');
  };

  if (step === 'generating') return <GeneratingQuizPage />;

  if (step === 'quiz' && quiz) {
    return (
      <QuizPage
        questions={quiz.questions}
        onNewQuiz={handleReset}
        initialTime={QUIZ_TIME[segmentId ? 'segment' : 'video']}
      />
    );
  }

  return (
    <QuizDifficultyModal
      isOpen={isOpen}
      onClose={onClose}
      onSelect={handleSelectDifficulty}
    />
  );
};