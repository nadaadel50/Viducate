import { COLORS } from "../../../../core/constants"

 type RightSectionProps={
    imgSrc:string,
    titleFirstPart:string,
    titleColoredPart:string,
    description:string

}
export function RightSection(props:RightSectionProps){
    return(
        <>
         <img  className="w-64 md:w-80 lg:w-90 h-auto" src={props.imgSrc} alt="" />
          <h2 style={{color:COLORS.text.primary}} className="mt-15 mb-4 text-3xl font-bold md:w-100 lg:w-130 text-center">{props.titleFirstPart}<span style={{color:COLORS.text.coloredText}}>{props.titleColoredPart}</span></h2>
          <p style={{color:COLORS.text.secondary}}>{props.description}</p>
        </>
    )
}