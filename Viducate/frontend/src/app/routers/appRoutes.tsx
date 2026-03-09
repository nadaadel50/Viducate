import { BrowserRouter, Route, Routes } from "react-router";
import { ProtectedRoute } from "./protextedRoutes";
import App from "../../App";
import { UploadVideoPage } from "../../features/video_upload/presentation/pages/upload_video_page";


export function AppRoutes() {
    return (
        <BrowserRouter>

        <Routes>


            /* here we will put all the public routes that don't need authentication to access them like landing page, signup */
            <Route path="/" element={<UploadVideoPage />} />  /* for example */

             <Route  element={<ProtectedRoute/>}>  // will prmove "/protected" soon
              /* here we will put all the protected routes that need authentication to access them */
             </Route>


                

        </Routes>
        
        </BrowserRouter>
    )
}