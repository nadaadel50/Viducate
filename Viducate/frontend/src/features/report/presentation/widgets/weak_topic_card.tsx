import { AlertTriangle } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { TopicTag } from "../componants/topic_tag";

interface WeakTopicsCardProps {
  topics: string[];
}

export function WeakTopicsCard({ topics }: WeakTopicsCardProps) {
  return (
    <div
      className="flex-1 rounded-2xl border p-5 shadow-sm"
      style={{
        backgroundColor: "#fff1f2",
        borderColor: "#fecdd3",
      }}
    >
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle size={20} className="text-rose-600" />

        <span
          className="text-sm font-bold uppercase tracking-wide"
          style={{ color: "#be123c" }}
        >
          <FormattedMessage id="report.topics.weak" />
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {topics.map((topic) => (
          <TopicTag key={topic} label={topic} variant="weak" />
        ))}
      </div>
    </div>
  );
}
