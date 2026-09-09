import React from "react";

const Loader = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex gap-2" role="status" aria-label="Loading">
        <span
          className="size-3 animate-ping rounded-full bg-blue-600 dark:bg-blue-300"
          aria-hidden="true"
        ></span>
        <span
          className="size-3 animate-ping rounded-full bg-blue-600 [animation-delay:0.2s] dark:bg-blue-300"
          aria-hidden="true"
        ></span>
        <span
          className="size-3 animate-ping rounded-full bg-blue-600 [animation-delay:0.4s] dark:bg-blue-300"
          aria-hidden="true"
        ></span>
      </div>
    </div>
  );
};

export default Loader;
