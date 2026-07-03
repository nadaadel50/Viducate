import { FONT_SIZE } from "../../../../../core/constants/fonts_update";
import { DoubleStorage } from "./double_storage";

type ProgressCardProps = {
  iconBackGround: string;
  icon: string;
  title: string;
  value?: string;
  usedLinked?: number;
  totalLinked?: number;
  usedUploaded?: number;
  totalUploaded?: number;
};

const colorClasses: Record<string, string> = {
  "blue-500": "bg-blue-500 shadow-blue-500/30",
  "emerald-500": "bg-emerald-500 shadow-emerald-500/30",
  "amber-500": "bg-purple-500 shadow-purple-500/30",
};

export function ProgressCard(props: ProgressCardProps) {
  const isDoubleStorage =
    props.usedLinked !== undefined && props.usedUploaded !== undefined;

  return (
    <div className="bg-white px-3 md:px-3 py-1 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-md cursor-pointer transition duration-300">
      <div
        className={`${colorClasses[props.iconBackGround]} p-2 rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-lg`}
      >
        <span style={{ fontSize: 18 }} className="material-symbols-outlined">
          {props.icon}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`${FONT_SIZE.size11} text-slate-500 font-medium uppercase tracking-wide mb-1`}
        >
          {props.title}
        </p>

        {isDoubleStorage ? (
          <DoubleStorage
            usedLinked={props.usedLinked!}
            totalLinked={props.totalLinked!}
            usedUploaded={props.usedUploaded!}
            totalUploaded={props.totalUploaded!}
          />
        ) : (
          <h4 className="text-base md:text-lg font-bold text-slate-900 truncate">
            {props.value}
          </h4>
        )}
      </div>
    </div>
  );
}
