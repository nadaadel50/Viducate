import { Link, Upload } from "lucide-react";
import { SelectBtn } from "./select_btn";
import type { SelectType } from "../../types/types";
import { FONT_STYLES } from "../../../../../core/constants/fonts";
import { useIntl } from "react-intl";
type SelectBoxProps = {
  handleSelected: (btnSelected: SelectType) => void;
  selected: string;
};

export function SelectBox({ handleSelected, selected }: SelectBoxProps) {
  const intl = useIntl();
  return (
    <div
      className="
        w-full
        max-w-md
        rounded-xl
        bg-gray-100
        p-1
        mb-4
      "
    >
      <div className={`flex w-full ${FONT_STYLES.button}`}>
        <div className="flex-1 min-w-0">
          <SelectBtn
            handleSelect={handleSelected}
            isSelected={selected === "upload"}
            text={intl.formatMessage({
              id: "upload.select.uploadFile",
            })}
            value="upload"
            icon={<Upload className="w-4 h-4 md:w-[18px] md:h-[18px]" />}
          />
        </div>

        <div className="flex-1 min-w-0">
          <SelectBtn
            handleSelect={handleSelected}
            isSelected={selected === "link"}
            text={intl.formatMessage({
              id: "upload.select.link",
            })}
            value="link"
            icon={<Link className="w-4 h-4 md:w-[18px] md:h-[18px]" />}
          />
        </div>
      </div>
    </div>
  );
}
