import { Bot, PanelRight } from "lucide-react";
import { FONT_STYLES } from "../../../../core/constants/fonts";
import { FormattedMessage, useIntl } from "react-intl";
type ChatHeaderProps = {
  videoTitle: string;
  handleOpenSession: () => void;
};

export function ChatHeader({ videoTitle, handleOpenSession }: ChatHeaderProps) {
  const intl = useIntl();

  return (
    <header className="flex w-full items-center justify-between gap-3 border-l border-white/20 bg-white/80 px-3 py-3 lg:px-4 lg:py-3 backdrop-blur-xl">
      <div className="flex min-w-0 items-center gap-3">
        {/* Bot Icon */}
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#359EFF] to-[#5A0BB1] text-white lg:h-8 lg:w-8">
          <Bot size={20} className="lg:h-[18px] lg:w-[18px]" />
        </span>

        {/* Title */}
        <div className="min-w-0">
          <h3 className={`${FONT_STYLES.chatTitle} text-slate-900`}>
            <FormattedMessage id="chat.header.title" />
          </h3>

          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />

            <p
              className={`${FONT_STYLES.chatStatus} truncate text-emerald-600`}
            >
              <>
                <FormattedMessage id="chat.header.active" /> • {videoTitle}
              </>
            </p>
          </div>
        </div>
      </div>

      {/* Open Sessions */}
      <button
        type="button"
        onClick={handleOpenSession}
        className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-all duration-200 hover:bg-[#4f46e5] hover:text-white hover:shadow-md active:scale-95 lg:h-8 lg:w-8"
      >
        <PanelRight
          aria-label={intl.formatMessage({
            id: "chat.header.openSessions",
          })}
          size={20}
          className="transition-transform duration-200 group-hover:scale-110 lg:h-[18px] lg:w-[18px]"
        />
      </button>
    </header>
  );
}
