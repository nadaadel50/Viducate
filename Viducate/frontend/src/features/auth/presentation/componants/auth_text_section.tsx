type MainTextProps = {
  bigTitle: string;
  smallTitle: string;
};
export function AuthMainText({ bigTitle, smallTitle }: MainTextProps){
    return(
        <div className="w-full">
            <div>
        <h2 className="lg:text-4xl font-black leading-tight tracking-[-0.033em] mb-3">
          {bigTitle}
        </h2>
        <p className="text-lg text-[#636988] dark:text-gray-300">{smallTitle}</p >
      </div>
        </div>
    )
}
