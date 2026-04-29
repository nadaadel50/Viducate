type CompleteProgressProps={
   
    cardsLenght:number,
    cardNumber:number

}

export function CompeleteProgress({cardsLenght,cardNumber}:CompleteProgressProps){

  const progress =
  ((cardNumber) / cardsLenght ) * 100;

  console.log(cardNumber)

    return(
        <div className="w-full max-w-2xl mb-8 flex flex-col gap-2 animate-fade-in-down">
        <div className="flex justify-between items-end mb-1">
          <span className="text-base font-semibold text-slate-700">{`Card ${cardNumber+1} of ${cardsLenght}`}</span>
          <span className="text-sm font-medium text-[#4f46e5]">{`${Math.round(progress)}% complete`}</span>
        </div>
        <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="relative h-full rounded-full transition-all duration-500 ease-out overflow-hidden">
            <div
              className="absolute inset-0 bg-[#4f46e5] rounded-full w-full h-full animate-pulse"
              // here also the complete percentage
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    )
}