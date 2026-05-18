import { formatStorage } from "../../utils/format_storage";

type ProgressCardProps = {
  iconBackGround: string;
  icon: string;
  title: string;
  value?: string;
  used?: number;  
  total?: number;  
};

const colorClasses: Record<string, string> = {
  "blue-500": "bg-blue-500 shadow-blue-500/30",
  "emerald-500": "bg-emerald-500 shadow-emerald-500/30",
  "amber-500": "bg-purple-500 shadow-purple-500/30",
};

export function ProgressCard(props: ProgressCardProps) {
  const percentage = props.used && props.total
    ? (props.used / props.total) * 100
    : null;

  return (
    <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 hover:-translate-y-1 hover:shadow-md cursor-pointer transition duration-300">

      <div className={`${colorClasses[props.iconBackGround]} p-2.5 rounded-xl flex items-center justify-center text-white shadow-lg`}>
        <span style={{ fontSize: 20 }} className="material-symbols-outlined">
          {props.icon}
        </span>
      </div>

      <div className="flex-1">
        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
          {props.title}
        </p>
       {props.used && props.total ? (
  <div>
    <span className="text-lg font-bold text-slate-900">
      {formatStorage(props.used)}
    </span>
    <span className="text-sm text-slate-400 font-medium"> / {formatStorage(props.total)}</span>
  </div>
) : (
  <h4 className="text-lg font-bold text-slate-900">{props.value}</h4>
)}
     
        {percentage !== null && (
          <div className="mt-1.5">
            <div className="bg-slate-100 rounded-full h-1.5 w-full">
              <div
                className={`${colorClasses[props.iconBackGround]} h-1.5 rounded-full transition-all duration-500`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {percentage.toFixed(1)}% used
            </p>
          </div>
        )}
      </div>

    </div>
  );
}