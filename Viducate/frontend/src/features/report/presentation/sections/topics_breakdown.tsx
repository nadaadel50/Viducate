import { TopicCard } from "../componants/topic_card";
import { SectionHeader } from "../componants/section_header";
import type { VideoReport } from "../../domain/entity/report_entity";
import { FormattedMessage, useIntl } from "react-intl";
import { Layers3 } from "lucide-react";

export function TopicsBreakdown({ report }: { report: VideoReport }) {
  const intl = useIntl();
  return (
    <section className="mt-2">
      <div className="flex items-center gap-3 mb-6">
        <SectionHeader icon={Layers3} title={intl.formatMessage({ id: "report.topicsBreakdown.title" })} />
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <FormattedMessage id="report.topicsBreakdown.count" values={{ count: report.topics.length }} />
        </span>
      </div>
      <div className="space-y-4">
        {report.topics.map((topic, i) => <TopicCard key={topic.id} topic={topic} index={i} />)}
      </div>
    </section>
  );
}