import { useDashboard } from "../../hooks/use_dashboard";
import { formatTimeToHoursMinutes } from "../../utils/format_dashboard_times";
import { ProgressCard } from "./progress_card";
import { useIntl } from "react-intl";
export function ProgressPart() {
  const { data } = useDashboard();
  const stats = data?.stats;
  const intl = useIntl();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      <ProgressCard
        iconBackGround="blue-500"
        icon="bookmark"
        title={intl.formatMessage({ id: "dashboard.progress.saved" })}
        value={stats?.total_videos_saved.toString() || "0"}
      />

      <ProgressCard
        iconBackGround="emerald-500"
        icon="schedule"
        title={intl.formatMessage({ id: "dashboard.progress.watched" })}
        value={formatTimeToHoursMinutes(
          stats?.total_watch_time_seconds || 0,
          intl,
        )}
      />

      <ProgressCard
        iconBackGround="amber-500"
        icon="storage"
        title={intl.formatMessage({ id: "dashboard.progress.storage" })}
        usedLinked={stats?.used_storage || 0}
        totalLinked={stats?.total_storage || 1}
        usedUploaded={stats?.used_r2_storage || 0}
        totalUploaded={stats?.total_r2_storage || 1}
      />
    </div>
  );
}
