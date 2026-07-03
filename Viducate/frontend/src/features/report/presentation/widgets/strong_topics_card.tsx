import { TrendingUp } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { TopicTag } from "../componants/topic_tag";

interface StrongTopicsCardProps {
  topics: string[];
}

export function StrongTopicsCard({ topics }: StrongTopicsCardProps) {
  return (
    <div
      className="rounded-2xl border p-5 shadow-sm"
      style={{
        backgroundColor: "#f0fdf4",
        borderColor: "#d1fae5",
      }}
    >
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp size={20} className="text-emerald-600" />

        <span
          className="text-sm font-bold uppercase tracking-wide"
          style={{ color: "#047857" }}
        >
          <FormattedMessage id="report.topics.strong" />
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {topics.map((topic) => (
          <TopicTag key={topic} label={topic} variant="strong" />
        ))}
      </div>
    </div>
  );
}
