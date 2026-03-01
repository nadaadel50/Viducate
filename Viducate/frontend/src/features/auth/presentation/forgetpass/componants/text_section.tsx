type MainTextProps = {
  bigTitle: string;
  smallTitle: string;
};
export function MainText({ bigTitle, smallTitle }: MainTextProps){
    return(
        <div className="w-full">
            <div>
        <h2 className="lg:text-4xl font-black leading-tight tracking-[-0.033em] mb-3">
          {bigTitle}
        </h2>
        <h3>{smallTitle}</h3>
      </div>
        </div>
    )
}