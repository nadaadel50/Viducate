type ProgressCardProps = {
    iconBackGround: string;
    icon: string;
    title: string;
    value: string;
}

export function ProgressCard(props: ProgressCardProps) {
    return(
         <div className="bg-white  p-6 rounded-3xl border border-slate-100  shadow-soft flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-100 cursor-pointer transition duration-300">
          <div className={`bg-${props.iconBackGround} p-3 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-${props.iconBackGround}/30`}>
            <span className="material-symbols-outlined">{props.icon}</span>
          </div>
          <div>
            <p className="text-xs text-slate-500  font-medium uppercase tracking-wider">
              {props.title}
            </p>
            <h4 className="text-2xl font-bold text-slate-900 ">{props.value}</h4>
          </div>
        </div>
    )
}