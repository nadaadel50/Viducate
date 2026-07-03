import { FormattedMessage } from "react-intl";
import MainText from "../../../../../core/componants/text_section";
import type { VideoStatusEntity } from "../../../domain/entity/video_status_entity";

type ProcessingHeaderProps = {
  status: VideoStatusEntity["status"];
};

export function ProcessingHeader({ status }: ProcessingHeaderProps) {
  const titleId =
    status === "failed"
      ? "analysis.error.title"
      : status === "completed"
        ? "analysis.complete"
        : "analysis.title";

  const subtitleId =
    status === "failed"
      ? "analysis.error.subtitle"
      : status === "completed"
        ? "analysis.ready"
        : "analysis.subtitle";

  return (
    <div className="text-center space-y-1.5">
      <MainText
        bigTitle={<FormattedMessage id={titleId} />}
        smallTitle={<FormattedMessage id={subtitleId} />}
      />
    </div>
  );
}
