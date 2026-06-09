export function ChartHeader(){
    return(
          <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-lg text-slate-900  flex items-center gap-3">
            <div className="p-2 bg-indigo-50  rounded-lg text-indigo-600">
              <span className="material-symbols-outlined">bar_chart</span>
            </div>
            Weekly Watching
          </h3>
          <p className="text-sm text-slate-500 bg-slate-50  px-3 py-1 rounded-full font-medium">
            Total:
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
              14.5 hrs
            </span>
          </p>
        </div>
    )
}