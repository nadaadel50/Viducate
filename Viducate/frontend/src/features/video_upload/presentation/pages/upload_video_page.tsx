import { UploadTitle } from "../componants/uplaod_title";

export function UploadVideoPage(){
    return(
        <div className="  flex justify-center items-center bg-[#f3f4f6] min-h-screen">
            <div className=" w-250 min-h-screen ">
                
                <UploadTitle bigTitle={"New Analysis"} smallTitle={"Upload a lecture recording or paste a link to get started."}/>

                {/* upload box */}

                <div className="bg-white flex justify-center items-center mt-10 ">

                     {/* choose link or upload */}

                    <div className="bg-gray-100  rounded-xl flex items-center space-x-1">
                        <button className="">Upload File</button>

                        <button>Youtube Link</button>
                    </div>



                </div>

            </div>

        </div>
    )

}