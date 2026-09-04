import Grid from "components/grid";

/**
 * Route-level skeleton for the listing pages. Mirrors the control bar and the
 * 2/3/4-column grid so the swap to real content doesn't jump.
 */
export default function Loading() {
  return (
    <div aria-hidden="true">
      <div className="mb-12 md:mb-16">
        <div className="h-2.5 w-20 animate-pulse bg-surface" />
        <div className="mt-4 h-10 w-72 animate-pulse bg-surface" />
        <div className="mt-10 flex items-center justify-between border-y border-border py-3.5">
          <div className="h-3 w-16 animate-pulse bg-surface" />
          <div className="h-3 w-24 animate-pulse bg-surface" />
        </div>
      </div>

      <Grid className="grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array(12)
          .fill(0)
          .map((_, index) => (
            <Grid.Item key={index}>
              <div className="aspect-[3/4] w-full animate-pulse bg-surface" />
              <div className="mt-4 h-3.5 w-3/4 animate-pulse bg-surface" />
              <div className="mt-2 h-3 w-16 animate-pulse bg-surface" />
            </Grid.Item>
          ))}
      </Grid>
    </div>
  );
}
