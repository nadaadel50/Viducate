import { useEffect, useState } from "react";
import type { SelectType } from "../types/types";
import { STORAGE_KEYS } from "../../../../core/constants";



export function useSelectBtnHandlers() {
  const [selected, setSelected] =useState(
      () => sessionStorage.getItem(STORAGE_KEYS.selectType) || "upload",
    );


  const handleSelected = (btnSelected: SelectType) => {
    setSelected(btnSelected);
  };

  useEffect(()=>{
    sessionStorage.setItem(STORAGE_KEYS.selectType ,selected);
  })

  

  return {
    selected,
    setSelected,
    handleSelected,
  };
}
