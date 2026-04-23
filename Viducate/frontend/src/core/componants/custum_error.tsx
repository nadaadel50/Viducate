type CustumErrorProps={
    apiError:string,
    clearError:() => void
}

export function CustumError(props:CustumErrorProps){
    return (
           
      
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between rounded-xl border border-red-100 bg-red-50 p-2">
          
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-red-600">
              error
            </span>

            <p className="text-sm font-medium text-red-800">{props.apiError}</p>
          </div>

          <button
            onClick={props.clearError}
            className="text-red-600 hover:text-red-800 mr-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
    

    )
}