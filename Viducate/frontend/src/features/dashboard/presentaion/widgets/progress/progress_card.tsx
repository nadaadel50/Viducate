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
    <div className="bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-md cursor-pointer transition duration-300">
      <div
        className={`${colorClasses[props.iconBackGround]} p-2.5 rounded-xl flex items-center justify-center text-white shadow-lg mt-1`}
      >
        <span style={{ fontSize: 20 }} className="material-symbols-outlined">
          {props.icon}
        </span>
      </div>

      <div className="flex-1">
        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-1">
          {props.title}
        </p>

       
        {isDoubleStorage ? (
         <DoubleStorage usedLinked={props.usedLinked!} totalLinked={props.totalLinked!} usedUploaded={props.usedUploaded!} totalUploaded={props.totalUploaded!}/>
        ) : (
         
          <h4 className="text-lg font-bold text-slate-900">{props.value}</h4>
        )}
      </div>
    </div>
  );
}
