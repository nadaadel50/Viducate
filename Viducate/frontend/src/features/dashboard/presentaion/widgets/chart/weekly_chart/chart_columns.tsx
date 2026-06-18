import { COLORS } from "../../../../../../core/constants";

type ChartColumnProps = {
  day: string;
  hours: string;
  height: string;
}

export function ChartColumn({ day, hours, height }: ChartColumnProps) {
  return (
     <div className="  flex-1 flex flex-col items-center gap-3 h-full justify-end  cursor-pointer">
              {/* {remove the 65% h} */}
              <div style={{ height: `${height}%` }}
              className="w-full max-w-[60px] flex flex-col  relative group">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] py-1 px-2 rounded-md   transition-all transform translate-y-1 group-hover:translate-y-0  z-20 shadow-lg">
                  {hours}
                </div>
                <div
                  style={{ background: COLORS.brand.gradient }}
                  className="w-full  rounded-t-xl h-full  opacity-70 hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0  cursor-pointer"
                ></div>
              </div>
              <span className="text-xs text-slate-500 font-medium absolute bottom-0">
                {day}
              </span>
            </div>
  );
}
