import { Leaf, Mountain, Zap } from "lucide-react";
import { BaseModal } from "../../../../core/componants/base_modal";
import { TopicEndCard } from "../../../../core/componants/topic_ended_card";
import { FormattedMessage, useIntl } from "react-intl";

type Difficulty = "easy" | "medium" | "hard";

interface QuizDifficultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (difficulty: Difficulty) => void;
}

export function QuizDifficultyModal({
  isOpen,
  onClose,
  onSelect,
}: QuizDifficultyModalProps) {
  const intl = useIntl();
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <div className="p-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-[#111218]">
            <FormattedMessage id="quiz.selectDifficultyTitle" />
          </h2>

          <p className="text-[#636988] mt-2">
            <FormattedMessage id="quiz.selectDifficultyDescription" />
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
          <div onClick={() => onSelect("easy")} className="cursor-pointer">
            <TopicEndCard
              variant="green"
              title={intl.formatMessage({ id: "quiz.easyTitle" })}
              description={intl.formatMessage({ id: "quiz.easyDescription" })}
              icon={<Leaf />}
            />
          </div>
          <div onClick={() => onSelect("medium")} className="cursor-pointer">
            <TopicEndCard
              variant="blue"
              title={intl.formatMessage({ id: "quiz.mediumTitle" })}
              description={intl.formatMessage({ id: "quiz.mediumDescription" })}
              icon={<Mountain />}
            />
          </div>
          <div onClick={() => onSelect("hard")} className="cursor-pointer">
            <TopicEndCard
              variant="red"
              title={intl.formatMessage({ id: "quiz.hardTitle" })}
              description={intl.formatMessage({ id: "quiz.hardDescription" })}
              icon={<Zap />}
            />
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
