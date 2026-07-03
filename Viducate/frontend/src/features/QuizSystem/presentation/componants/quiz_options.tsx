import type {
  QuizQuestionEntity,
  QuizSubmitQuestion,
} from "../../domain/entity/quiz_entity";
import { useQuizOptions } from "../hooks/use_quiz_options";
import { QuizExplanation } from "../widgets/quiz_explaintion";
import { QuizOptionItem } from "../widgets/quiz_option_item";
import { QuizQuestionHeader } from "../widgets/quiz_quesions_header";

interface QuizOptionsProps {
  question: QuizQuestionEntity;
  selectedId: string | null;
  onSelect: (optionId: string) => void;
  isReviewMode: boolean;
  submitQuestion?: QuizSubmitQuestion;
}

export function QuizOptions({
  question,
  selectedId,
  onSelect,
  isReviewMode,
  submitQuestion,
}: QuizOptionsProps) {
  const { options, getOptionStyle } = useQuizOptions({
    question,
    selectedId,
    isReviewMode,
    submitQuestion,
  });

  if (!question) return null;

  return (
    <section className="space-y-5">
      <QuizQuestionHeader question={question} isReviewMode={isReviewMode} />

      {isReviewMode && submitQuestion?.explanation && (
        <QuizExplanation explanation={submitQuestion.explanation} />
      )}

      <div className="flex flex-col gap-2.5">
        {options.map((option) => (
          <QuizOptionItem
            key={option.id}
            option={option}
            optionState={getOptionStyle(option.id)}
            isReviewMode={isReviewMode}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}
