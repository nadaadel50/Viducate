import { FONT_STYLES } from "../../../../core/constants/fonts";

type MainTextProps = {
  bigTitle: string;
  smallTitle: string;
};

export function AuthMainText({
  bigTitle,
  smallTitle,
}: MainTextProps) {
  return (
    <div className="w-full mb-6">
      <h2
        className={`
          ${FONT_STYLES.pageTitle}
          mb-2
          leading-tight
          tracking-[-0.033em]
        `}
      >
        {bigTitle}
      </h2>

      <p
        className={`
          ${FONT_STYLES.subtitle}
          text-[#636988]
          dark:text-gray-300
        `}
      >
        {smallTitle}
      </p>
    </div>
  );
}

export default AuthMainText;