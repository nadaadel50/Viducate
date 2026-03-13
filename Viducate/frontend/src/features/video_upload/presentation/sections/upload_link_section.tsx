import { LinkSection } from "./link_section";
import { InputSection } from "../componants/input_section";
import { UploadBtn } from "../componants/upload_btn";
import { useLinkHandlers } from "../hooks/use_link_handler";
import { useLinkTitleInput } from "../hooks/use_link_input_handler";

;

export function UploadLinkSection() {

  const { url, handleUrlChange, linkError, handlePaste } = useLinkHandlers();
  const {
  linkTitle,
  linkTitleError,
  handleLinkTitle
} = useLinkTitleInput();

  return (
    <>
      <LinkSection
        url={url}
        error={linkError}
        handleUrlChange={handleUrlChange}
        handlePaste={handlePaste}
      />

      <InputSection
        title={linkTitle}
        error={linkTitleError}
        handleTitle={handleLinkTitle}
      />

      <UploadBtn
        disabled={linkError || url === "" || linkTitle === ""}
        label={"Upload link"}
        onClick={() => {}}
      />
    </>
  );
}