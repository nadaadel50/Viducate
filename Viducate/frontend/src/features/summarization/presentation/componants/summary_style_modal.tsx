import { ClipboardList, FileText } from "lucide-react";
import { BaseModal } from "../../../../core/componants/base_modal";
import { TopicEndCard } from "../../../../core/componants/topic_ended_card";
import { FormattedMessage } from "react-intl";
type SummaryStyle = "summary" | "study_notes";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (style: SummaryStyle) => void;
};

export function SummaryStyleModal({ isOpen, onClose, onSelect }: Props) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <div className="p-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-[#111218]"><FormattedMessage id="summary.selectStyleTitle" /></h2>
          <p className="text-[#636988] mt-2"><FormattedMessage id="summary.selectStyleDescr" /></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-10">
          <TopicEndCard
            variant="purple"
            title="Study Notes"
            description="Detailed points and key concepts for deep learning"
            icon={<ClipboardList />}
            onClick={() => {
              onClose();
              onSelect("study_notes");
            }}
          />
          <TopicEndCard
            variant="blue"
            title="Summary"
            description="Concise overview of the topic for quick revision"
            icon={<FileText />}
            onClick={() => {
              onClose();
              onSelect("summary");
            }}
          />
        </div>
      </div>
    </BaseModal>
  );
}