import { Layers3 } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

import {
  FONT_SIZE,
  FONT_WEIGHT,
} from "../../../../core/constants/fonts_update";

import { SectionHeader } from "../componants/section_header";
import { TopicCard } from "../componants/topic_card";

import type { VideoReport } from "../../domain/entity/report_entity";

interface TopicsBreakdownProps {
  report: VideoReport;
}

export function TopicsBreakdown({ report }: TopicsBreakdownProps) {
  const intl = useIntl();

  return (
    <section className="mt-2 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionHeader
          icon={Layers3}
          title={intl.formatMessage({
            id: "report.topicsBreakdown.title",
          })}
        />

        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 ${FONT_SIZE.size11} ${FONT_WEIGHT.bold}`}
          style={{
            backgroundColor: "#eef2ff",
            color: "#4f46e5",
            borderColor: "#c7d2fe",
          }}
        >
          <FormattedMessage
            id="report.topicsBreakdown.count"
            values={{
              count: report.topics.length,
            }}
          />
        </span>
      </div>

      <div className="space-y-3">
        {report.topics.map((topic, index) => (
          <TopicCard key={topic.id} topic={topic} index={index} />
        ))}
      </div>
    </section>
  );
}
