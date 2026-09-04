import clsx from "clsx";
import LogoIcon from "./icons/logo";

/**
 * The house mark, set in a hairline square. Sharp corners rather than the
 * template's rounded ones — the whole design language avoids border radius.
 */
export default function LogoSquare({ size }: { size?: "sm" | undefined }) {
  return (
    <div
      className={clsx(
        "flex flex-none items-center justify-center border border-current/25",
        {
          "h-10 w-10": !size,
          "h-8 w-8": size === "sm",
        },
      )}
    >
      <LogoIcon
        className={clsx({
          "h-[15px] w-[15px]": !size,
          "h-3 w-3": size === "sm",
        })}
      />
    </div>
  );
}
