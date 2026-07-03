import { FormattedMessage } from "react-intl";

import { CustomButton } from "../../../../core/componants/custum_btn";
import CustumBtnLoader from "../../../../core/componants/custum_btn_loader";

import { COLORS } from "../../../../core/constants/colors";

type CustomizeFooterProps = {
  isSubmitting: boolean;
  onClose: () => void;
  onSave: () => void;
};

export function CustomizeFooter({
  isSubmitting,
  onClose,
  onSave,
}: CustomizeFooterProps) {
  return (
    <footer className="flex items-center justify-end gap-3 rounded-b-2xl border-t border-gray-100 bg-gray-50 p-5 md:p-6">
      <CustomButton
        onClick={onClose}
        className="border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
      >
        <FormattedMessage id="customize.skip" />
      </CustomButton>

      <CustomButton
        onClick={onSave}
        className="text-white shadow-md hover:shadow-lg"
        style={{
          background: COLORS.brand.gradient,
        }}
      >
        {isSubmitting ? (
          <CustumBtnLoader color="bg-white" />
        ) : (
          <FormattedMessage id="customize.save" />
        )}
      </CustomButton>
    </footer>
  );
}
