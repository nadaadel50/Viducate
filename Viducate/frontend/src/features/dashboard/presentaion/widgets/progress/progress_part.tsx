import { useDashboard } from "../../hooks/use_dashboard";
import { formatTimeToHoursMinutes } from "../../utils/format_dashboard_times";
import { ProgressCard } from "./progress_card";

export function ProgressPart() {
  const { data } = useDashboard();
  const stats = data?.stats;




  return (
    <div className="grid grid-cols-3 gap-3  ">
      <ProgressCard
        iconBackGround="blue-500"
        icon="bookmark"
        title="Saved"
        value={stats?.total_videos_saved.toString() || "0"}
      />
      <ProgressCard
        iconBackGround="emerald-500"
        icon="schedule"
        title="Watched"
        value={formatTimeToHoursMinutes(stats?.total_watch_time_seconds || 0)}
      />
      <ProgressCard
        iconBackGround="amber-500"
        icon="storage"
        title="Storage"
        used={stats?.used_storage || 0}
        total={stats?.total_storage || 1}
      />
    </div>
  );
}
