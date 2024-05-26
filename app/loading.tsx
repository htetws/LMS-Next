"use client";
import ClipLoader from "react-spinners/ClipLoader";

const Loading = () => {
  return (
    <div className="w-screen h-screen absolute inset-0 flex items-center justify-center">
      <ClipLoader size={100} />
    </div>
  );
};

export default Loading;
