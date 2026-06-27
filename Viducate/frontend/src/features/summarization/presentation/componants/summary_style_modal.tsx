import { ClipboardList, FileText } from "lucide-react";
import { FormattedMessage } from "react-intl";

import { BaseModal } from "../../../../core/componants/base_modal";
import { TopicEndCard } from "../../../../core/componants/topic_ended_card";
import {
  FONT_SIZE,
  FONT_WEIGHT,
  LINE_HEIGHT,
} from "../../../../core/constants/fonts_update";

type SummaryStyle = "summary" | "study_notes";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (style: SummaryStyle) => void;
};

const SUMMARY_OPTIONS = [
  {
    id: "study_notes",
    variant: "purple",
    title: "Study Notes",
    description: "Detailed points and key concepts for deep learning",
    icon: <ClipboardList />,
  },
  {
    id: "summary",
    variant: "blue",
    title: "Summary",
    description: "Concise overview of the topic for quick revision",
    icon: <FileText />,
  },
] as const;

export function SummaryStyleModal({
  isOpen,
  onClose,
  onSelect,
}: Props) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-3xl"
    >
      <div className="p-6 md:p-8 lg:p-10">
        <header className="mb-8 text-center lg:mb-10">
          <h2
            className={`
              ${FONT_SIZE.size24}
              ${FONT_WEIGHT.black}
              text-[#111218]
            `}
          >
            <FormattedMessage id="summary.selectStyleTitle" />
          </h2>

          <p
            className={`
              ${FONT_SIZE.size14}
              ${LINE_HEIGHT.relaxed}
              mt-2
              text-[#636988]
            `}
          >
            <FormattedMessage id="summary.selectStyleDescr" />
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:px-8">
          {SUMMARY_OPTIONS.map((option) => (
            <TopicEndCard
              key={option.id}
              variant={option.variant}
              title={option.title}
              description={option.description}
              icon={option.icon}
              onClick={() => {
                onClose();
                onSelect(option.id);
              }}
            />
          ))}
        </div>
      </div>
    </BaseModal>
  );
}