const Loader = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex gap-2" role="status" aria-label="Loading">
        <span
          className="size-3 animate-ping rounded-full bg-primary"
          aria-hidden="true"
        ></span>
        <span
          className="size-3 animate-ping rounded-full bg-primary [animation-delay:0.2s]"
          aria-hidden="true"
        ></span>
        <span
          className="size-3 animate-ping rounded-full bg-primary [animation-delay:0.4s]"
          aria-hidden="true"
        ></span>
      </div>
    </div>
  );
};

export default Loader;
