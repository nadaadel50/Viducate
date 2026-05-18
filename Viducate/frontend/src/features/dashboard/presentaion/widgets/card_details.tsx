export function CardDetails() {
    return(
           <div className="p-5">
              <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
                Intro to Astrophysics
              </h3>

              <div className="flex items-center  gap-4 text-sm text-slate-500">
                <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-semibold">
                  75% Complete
                </span>

                <span className="flex items-center gap-1">
                  <span
                    style={{ fontSize: 18 }}
                    className="material-symbols-outlined"
                  >
                    schedule
                  </span>
                  2h 15m
                </span>
              </div>
            </div>
    )
}