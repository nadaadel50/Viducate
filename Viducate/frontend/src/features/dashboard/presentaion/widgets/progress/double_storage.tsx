import { formatStorage } from "../../utils/format_storage";
import { FormattedMessage } from "react-intl";
const colorClasses: Record<string, string> = {
  "amber-500": "bg-amber-500",
  "indigo-500": "bg-indigo-500",
};

type DoubleStorageProps = {
  usedLinked: number;
  totalLinked: number;
  usedUploaded: number;
  totalUploaded: number;
};

function MiniProgressBar({
  used,
  total,
  color,
}: {
  used: number;
  total: number;
  color: string;
}) {
  const pct = Math.min((used / total) * 100, 100);

  const progressColor = pct >= 100 ? "bg-red-500" : colorClasses[color];

  return (
    <div className="bg-slate-100 rounded-full h-1.5 w-full">
      <div
        className={`${progressColor} h-1.5 rounded-full transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function DoubleStorage({
  usedLinked,
  totalLinked,
  usedUploaded,
  totalUploaded,
}: DoubleStorageProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Linked */}
      <div>
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 11 }}
            >
              link
            </span>
            <FormattedMessage id="dashboard.storage.linked" />
          </span>

          <span className="text-[10px] text-slate-500 font-medium">
            {formatStorage(usedLinked)} / {formatStorage(totalLinked)}
          </span>
        </div>

        <MiniProgressBar
          used={usedLinked}
          total={totalLinked}
          color="amber-500"
        />
      </div>

      {/* Uploaded */}
      <div>
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 11 }}
            >
              upload
            </span>
            <FormattedMessage id="dashboard.storage.uploaded" />
          </span>

          <span className="text-[10px] text-slate-500 font-medium">
            {formatStorage(usedUploaded)} / {formatStorage(totalUploaded)}
          </span>
        </div>

        <MiniProgressBar
          used={usedUploaded}
          total={totalUploaded}
          color="indigo-500"
        />
      </div>
    </div>
  );
}
