export function CardLayout(){
    return(
         <div className="relative aspect-video bg-slate-200  overflow-hidden rounded-t-2xl">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXN0cm9waHlzaWNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60)",
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full border border-white/50 shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                  <span className="material-symbols-outlined text-white text-2xl">
                    play_arrow
                  </span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-200/30">
                <div className="h-full bg-indigo-500 w-[45%] shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
              </div>
              <div className="absolute top-3 right-3 bg-black/50 text-white text-[9px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10">
                12:40 left
              </div>
            </div>
    )
}