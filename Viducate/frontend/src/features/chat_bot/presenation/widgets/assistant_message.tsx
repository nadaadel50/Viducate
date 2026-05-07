import { Bot } from "lucide-react"

type AssistantMessageProps={
    message:string
    senededTime:string
   
}

export function AssistantMessage(props:AssistantMessageProps){
    return(
        <div className="flex flex-col items-start gap-3">
              <div className="flex gap-2">
                <span className="bg-gradient-to-br from-[#359EFF] to-[#5A0BB1] h-10 w-10 rounded-xl flex items-center justify-center text-white">
                  {" "}
                  <Bot />
                </span>

                <div className="bg-white  rounded-3xl rounded-tl-none px-6 py-4 max-w-[80%] shadow-lg shadow-[#4f46e5]/10">
                  <p className="text-sm leading-relaxed">
                    {props.message}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mr-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                 { ` Viducate ai assistant • ${props.senededTime} mins ago`}
                </span>
              </div>
            </div>
    )
}