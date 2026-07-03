type UploadTitleProps = {
  bigTitle: string;
  smallTitle: string;
};

export function UploadTitle({ bigTitle, smallTitle }: UploadTitleProps) {
  return (
    <div className="w-full">
      <div>
        <h2
          className="
            text-2xl
            sm:text-3xl
            lg:text-4xl
            font-black
            mb-2
            text-gray-900
          "
        >
          {bigTitle}
        </h2>

        <p
          className="
            text-sm
            sm:text-base
            lg:text-lg
            text-gray-500
          "
        >
          {smallTitle}
        </p>
      </div>
    </div>
  );
}
