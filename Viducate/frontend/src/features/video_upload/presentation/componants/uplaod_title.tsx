type UploadTitleProps = {
  bigTitle: string;
  smallTitle: string;
};

export function UploadTitle({ bigTitle, smallTitle }: UploadTitleProps){

    return(
        <div className="w-full">
            <div>
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">
          {bigTitle}
        </h2>
        <p className="text-gray-500 text-lg">{smallTitle}</p >
      </div>
        </div>
    )

}

