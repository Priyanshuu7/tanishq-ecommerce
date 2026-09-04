import clsx from "clsx";

/**
 * Product grid. Column counts are set by the caller; the default here is only
 * the spacing rhythm — generous vertical gutters, tight horizontal ones, so
 * the imagery reads as a continuous editorial spread.
 */
function Grid(props: React.ComponentProps<"ul">) {
  return (
    <ul
      {...props}
      className={clsx(
        "grid grid-flow-row gap-x-4 gap-y-12 md:gap-x-6 md:gap-y-16",
        props.className,
      )}
    >
      {props.children}
    </ul>
  );
}

/**
 * A grid cell. Deliberately imposes no aspect ratio: the card is an image well
 * with its title and price set beneath, so the ratio belongs to the image, not
 * the cell.
 */
function GridItem(props: React.ComponentProps<"li">) {
  return (
    <li {...props} className={clsx("group/card", props.className)}>
      {props.children}
    </li>
  );
}

Grid.Item = GridItem;

export default Grid;
