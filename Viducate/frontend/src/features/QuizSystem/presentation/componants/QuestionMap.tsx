
import { FormattedMessage } from 'react-intl';
import { COLORS } from "../../../../core/constants";

type Question = {
  question_id: number;
};

type AnswersMap = Record<string | number, unknown>;

type QuestionMapProps = {
  questions: Question[];
  currentIndex: number;
  answers: AnswersMap;
  onNavigate: (index: number) => void;
};

export const QuestionMap = ({ questions, currentIndex, answers, onNavigate }: QuestionMapProps) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: COLORS.border.default }}>
    <h3 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: COLORS.text.secondary }}>
      <FormattedMessage id="quiz.map_title" />
    </h3>
    
    <div className="grid grid-cols-5 gap-2">
      {questions.map((q, idx) => {
        const isCurrent = idx === currentIndex;
        const isAnswered = !!answers[q.question_id];
        
        
        const btnStyle = {
          backgroundColor: COLORS.state.pending,
          color: COLORS.text.secondary,
          border: '2px solid transparent'
        };

        if (isCurrent) {
          btnStyle.backgroundColor = COLORS.icon.background;
          btnStyle.color = COLORS.brand.primary;
          btnStyle.border = `2px solid ${COLORS.brand.primary}`;
        } else if (isAnswered) {
          btnStyle.backgroundColor = COLORS.brand.primary;
          btnStyle.color = COLORS.text.white;
        }

        return (
          <button 
            key={q.question_id}
            onClick={() => onNavigate(idx)}
            className="aspect-square flex items-center justify-center rounded-lg text-sm font-bold transition-all hover:brightness-95"
            style={btnStyle}
          >
            {idx + 1}
          </button>
        );
      })}
    </div>
  </div>
);