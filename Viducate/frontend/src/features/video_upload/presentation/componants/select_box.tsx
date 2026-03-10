import { Link, Upload } from "lucide-react"
import { SelectBtn } from "./select_btn"
import type { SelectType } from "../types/types"



type SelectBoxProps={
    handleSelected:(btnSelected: SelectType) => void
    selected:string

}

export function SelectBox({handleSelected,selected}:SelectBoxProps){
    return(
        <div className="flex items-center justify-center text-gray-500 font-semibold  bg-gray-100  p-1 rounded-xl ">
              {/* button  */}

              <SelectBtn
                handleSelect={handleSelected}
                isSelected={selected === "upload"}
                text={"Uplaod File"}
                value="upload"
                icon={<Upload width={18} />}
              />

              <SelectBtn
                handleSelect={handleSelected}
                isSelected={selected === "link"}
                text={"Link"}
                value="link"
                icon={<Link width={18} />}
              />
            </div>
    )
}