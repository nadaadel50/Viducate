type CustumBtnLoaderProps = {
  color?: string;
};

const CustumBtnLoader = ({ color = "bg-white" }: CustumBtnLoaderProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex gap-1">
        <span
          className={`w-2 h-2 ${color} rounded-full animate-bounce [animation-duration:0.6s]`}
        ></span>
        <span
          className={`w-2 h-2 ${color} rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.05s]`}
        ></span>
        <span
          className={`w-2 h-2 ${color} rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.1s]`}
        ></span>
        <span
          className={`w-2 h-2 ${color} rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.15s]`}
        ></span>
        <span
          className={`w-2 h-2 ${color} rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]`}
        ></span>
      </div>
    </div>
  );
};

export default CustumBtnLoader;
