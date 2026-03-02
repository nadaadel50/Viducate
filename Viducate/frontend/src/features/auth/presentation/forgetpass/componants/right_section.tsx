import { COLORS } from "../../../../../core/constants";


export function RightSection(){
    return(
        <>
         <img  className="w-64 md:w-80 lg:w-96 h-auto" src="src/assets/forget_pass_2.svg " alt="" />
          <h2 style={{color:COLORS.PrimaryText}} className="mt-15 mb-4 md:text-3xl lg:text-4xl font-bold  text-center">Securely reset your password <span style={{color:COLORS.PrimaryColor}}>and continue your learning journey</span></h2>
          <p style={{color:COLORS.SecondyText}}>It only takes a few seconds to get back on track</p>
        </>
    )
}