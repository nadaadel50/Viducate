import { formatMessageTime } from "../../../../core/utils/fomat_time"


type UserMessageProps={
    message:string
    senededTime:number
   
}

export function UserMessage(props:UserMessageProps){

    return(
        <div className="flex flex-col items-end gap-3">
           
              <div className={`bg-[#4f46e5] text-white rounded-3xl rounded-tr-none px-6 py-4 max-w-[80%] shadow-lg shadow-[#4f46e5]/10`}>
                <p dir="auto"
                 className="text-sm leading-relaxed">
                  {props.message}
                </p>
              </div>
              <div className="flex items-center gap-2 mr-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                 { `You • ${formatMessageTime(props.senededTime)}`}
                </span>
              </div>
            </div>
    )
}