import clsx from "clsx";

// `animate-blink` is generated from the --animate-blink token in globals.css.
// It had no definition before, so these dots were previously static.
const dots = "mx-[1.5px] inline-block h-[3px] w-[3px] animate-blink";

const LoadingDots = ({ className }: { className: string }) => {
  return (
    <span className="mx-2 inline-flex items-center">
      <span className={clsx(dots, className)} />
      <span className={clsx(dots, "[animation-delay:200ms]", className)} />
      <span className={clsx(dots, "[animation-delay:400ms]", className)} />
    </span>
  );
};

export default LoadingDots;
