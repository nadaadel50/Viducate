import { ProgressCard } from "./progress_card";

export function ProgressPart() {
  return (
    <div className="grid grid-cols-3 gap-6  ">
      <ProgressCard
        iconBackGround="blue-500"
        icon="bookmark"
        title="Saved"
        value="12"
      />
      <ProgressCard
        iconBackGround="emerald-500"
        icon="schedule"
        title="Watched"
        value="8h 30m"
      />
      
      <ProgressCard
        iconBackGround="purple-500"
        icon="task_alt"
        title="Completed"
        value="73%"
      />
    </div>
  );
}
