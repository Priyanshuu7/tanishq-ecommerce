import { FilmPlayer } from "components/media/film-player";
import { AnimatedReveal } from "components/motion/animated-reveal";
import { SectionHeading } from "components/ui/section-heading";
import { filmGrid, type GridFilm } from "lib/editorial";
import Link from "next/link";

/**
 * Four films, two across, every tile a perfect square.
 *
 * `aspect-square` on the tile plus `object-cover` on the film is what
 * guarantees the square: footage of any ratio is centre-cropped rather than
 * letterboxed, so the grid stays a clean lattice whatever the masters are.
 *
 * The lattice is edge-to-edge and gapless — the four films butt directly
 * against each other and against the viewport, so each tile is exactly half the
 * screen wide. That is why the grid sits outside `layout-wide`: only the heading
 * takes the page gutter.
 *
 * Two columns rather than four because the reference lays these out at roughly
 * half the viewport each — at four across a square tile is small enough that
 * the footage stops reading. To switch, change `sm:grid-cols-2` below.
 *
 * The section removes itself entirely when no film has a `src`, so it stays
 * invisible until there is something real to show.
 */
export function FilmGrid() {
  const films = filmGrid.films.filter((film) => film.src);
  if (films.length === 0) return null;

  return (
    <section className="section-y">
      <div className="layout-wide">
        <SectionHeading
          eyebrow={filmGrid.eyebrow}
          heading={filmGrid.heading}
          align="center"
        />
      </div>

      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2">
        {films.map((film, index) => (
          // Keyed by position, not by `src` — nothing stops the same file being
          // used in two tiles, and duplicate keys would drop one of them.
          <FilmTile key={index} film={film} delay={index * 110} />
        ))}
      </div>
    </section>
  );
}

function FilmTile({ film, delay }: { film: GridFilm; delay: number }) {
  const tile = (
    <div className="relative aspect-square overflow-hidden bg-surface">
      {/* The reveal is applied inside the square, not to the grid cell.
          `zoom` opens at scale(1.06); on a gapless full-bleed lattice a cell
          scaled up has nowhere to grow — it would overlap its neighbour and push
          past the viewport edge, which on mobile means a horizontal scrollbar.
          Clipped by the square's own overflow-hidden, the film settles out of the
          zoom while the lattice itself never moves. */}
      <AnimatedReveal variant="zoom" delay={delay} className="absolute inset-0">
        <FilmPlayer
          src={film.src}
          poster={film.poster}
          label={film.label}
          scrim={false}
          className="transition-transform duration-(--duration-slower) ease-(--ease-luxe) group-hover:scale-[1.04]"
        />
      </AnimatedReveal>

      {film.caption ? (
        <div className="media-scrim absolute inset-x-0 bottom-0 z-10 p-6">
          <p className="t-nav text-on-media">{film.caption}</p>
        </div>
      ) : null}
    </div>
  );

  return film.href ? (
    <Link href={film.href} className="group block">
      {tile}
    </Link>
  ) : (
    tile
  );
}
