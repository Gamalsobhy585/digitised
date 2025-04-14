import { LoaderCircle } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <LoaderCircle size={48} className="text-primary animate-spin" />
    </div>
  );
};

export default Loading;
