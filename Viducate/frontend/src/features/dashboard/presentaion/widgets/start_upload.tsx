import { useNavigate } from "react-router";
import NoSavedVideosAnimation from "../../../../core/animations/no_saved_videos";
import { AppRoutesNames } from "../../../../app/routers/routes";
import { FormattedMessage } from "react-intl";
export function StartUpload() {
  const navigate=useNavigate()
    return(
         <div className="flex flex-col items-center justify-center  gap-4">
        <NoSavedVideosAnimation />

        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800"><FormattedMessage id="dashboard.empty.title" /></h2>
          <p className="text-sm text-slate-400 mt-1">
            <FormattedMessage id="dashboard.empty.description" />
          </p>
        </div>

        <button 
        onClick={()=>{
          navigate(AppRoutesNames.uploadPage)
        }}
        className="inline-flex  items-center gap-2 text-sm cursor-pointer text-indigo-500 border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 font-medium py-2.5 px-6 rounded-2xl transition-all duration-300">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            add_circle
          </span>
          <FormattedMessage id="dashboard.empty.addFirstVideo" />
        </button>
      </div>
    )
}