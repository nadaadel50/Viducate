import { UploadCloud } from "lucide-react";
import { COLORS } from "../../../../core/constants";
import { FONT_STYLES } from "../../../../core/constants/fonts";
import { FormattedMessage } from "react-intl";
export type UploadSectionProps = {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleBrowseClick: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
};

export function UploadSection(props: UploadSectionProps) {
  return (
    <div
      onDragOver={props.handleDragOver}
      onDrop={props.handleDrop}
      className="group w-full mt-6 md:mt-3 mb-6 md:mb-3 py-5 md:py-6 px-4 bg-gray-50 hover:bg-blue-50 border-2 border-dashed border-gray-300 rounded-xl transition-colors cursor-pointer flex flex-col items-center"
    >
      <div
        onClick={props.handleBrowseClick}
        style={{ background: COLORS.brand.gradient }}
        className="flex items-center justify-center rounded-full p-3"
      >
        <UploadCloud
          strokeWidth={2}
          className="w-8 h-8 md:w-9 md:h-9 text-white transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="flex flex-col items-center text-center mt-4 mb-4">
        <h2 className={`${FONT_STYLES.cardTitle} text-gray-900`}>
          <FormattedMessage id="upload.video.dragDrop" />
        </h2>

        <p className={`${FONT_STYLES.subtitle} mt-1`}>
          <FormattedMessage id="upload.video.supportedFormats" />
        </p>
      </div>

      <input
        type="file"
        ref={props.fileInputRef}
        accept="video/*"
        className="hidden"
        onChange={props.handleFileChange}
      />

      <button
        onClick={props.handleBrowseClick}
        className="px-4 md:px-5 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <span className={FONT_STYLES.button}>
          <FormattedMessage id="upload.video.browseFiles" />
        </span>
      </button>
    </div>
  );
}
