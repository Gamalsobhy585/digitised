import { cn } from "../lib/utils";
import { LoaderCircle } from "lucide-react";
import React from "react";

const Spinner = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex justify-center items-center min-h-[calc(100vh-7.625rem)]",
        className
      )}
    >
      <LoaderCircle size={48} className="text-primary animate-spin" />
    </div>
  );
};

export default Spinner;
