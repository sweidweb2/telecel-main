import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * "Connected Energies" motif: an original modular strip on a 32×32 unit grid,
 * inspired by (not copied from) the Telecel brand-pattern language —
 * signal arcs, paired routes, dot sequences, hollow terminals, waves.
 * Rules: 1.5 strokes, 90° rotations only, mostly grey, ONE connected red
 * route. Always decorative (aria-hidden); never put meaning only here.
 */

type Glyph = "arcs" | "routes" | "dots" | "terminal" | "wave" | "node" | "bars";
type Cell = { glyph: Glyph; rotate?: 0 | 90 | 180 | 270; red?: boolean };

const GLYPHS: Record<Glyph, ReactNode> = {
  arcs: (
    <>
      <path d="M4 22 A6 6 0 0 1 10 28" />
      <path d="M4 16 A12 12 0 0 1 16 28" />
      <path d="M4 10 A18 18 0 0 1 22 28" />
      <circle cx="4" cy="28" r="2" fill="currentColor" stroke="none" />
    </>
  ),
  routes: (
    <>
      <path d="M10 0 V16 Q10 26 20 26 H32" />
      <path d="M16 0 V14 Q16 20 22 20 H32" />
    </>
  ),
  dots: (
    <>
      {[5, 12, 19, 26].map((cy) => (
        <circle key={cy} cx="16" cy={cy} r="1.8" fill="currentColor" stroke="none" />
      ))}
    </>
  ),
  terminal: (
    <>
      <rect x="10" y="6" width="12" height="12" />
      <path d="M16 18 V32" />
    </>
  ),
  wave: <path d="M0 16 q4 -7 8 0 t8 0 t8 0 t8 0" />,
  node: (
    <>
      <circle cx="16" cy="16" r="6" />
      <circle cx="16" cy="16" r="1.8" fill="currentColor" stroke="none" />
      <path d="M16 0 V10 M16 22 V32" />
    </>
  ),
  bars: <path d="M7 9 H25 M7 16 H25 M7 23 H17" />,
};

/** Fixed composition (2 cells wide). The red cells form one connected route. */
const STRIP: Cell[][] = [
  [{ glyph: "arcs" }, { glyph: "dots" }],
  [{ glyph: "terminal" }, { glyph: "routes", rotate: 90 }],
  [{ glyph: "wave" }, { glyph: "bars" }],
  [{ glyph: "bars" }, { glyph: "node", red: true }],
  [{ glyph: "dots", rotate: 90 }, { glyph: "node", red: true }],
  [{ glyph: "routes", red: true, rotate: 180 }, { glyph: "arcs", rotate: 270 }],
  [{ glyph: "terminal", rotate: 180 }, { glyph: "wave", rotate: 90 }],
  [{ glyph: "arcs", rotate: 90 }, { glyph: "terminal" }],
];

type SignalMotifProps = {
  /** Number of 2-cell rows to draw (cycles through the composition). */
  rows?: number;
  orientation?: "vertical" | "horizontal";
  tone?: "light" | "dark";
  className?: string;
};

export function SignalMotif({
  rows = STRIP.length,
  orientation = "vertical",
  tone = "light",
  className,
}: SignalMotifProps) {
  const cells = Array.from({ length: rows }, (_, row) => STRIP[row % STRIP.length]);
  const long = rows * 32;
  const vertical = orientation === "vertical";

  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox={vertical ? `0 0 64 ${long}` : `0 0 ${long} 64`}
      className={cn(
        "shrink-0",
        tone === "dark" ? "text-[#5a5a58]" : "text-[#b9b9b5]",
        className
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {cells.map((pair, row) =>
        pair.map((cell, col) => {
          const x = vertical ? col * 32 : row * 32;
          const y = vertical ? row * 32 : col * 32;
          const rotate = (cell.rotate ?? 0) + (vertical ? 0 : 90);
          return (
            <g
              key={`${row}-${col}`}
              transform={`translate(${x} ${y}) rotate(${rotate} 16 16)`}
              // Only the first pass of the composition carries the red route.
              className={cell.red && row < STRIP.length ? "text-brand" : undefined}
            >
              {GLYPHS[cell.glyph]}
            </g>
          );
        })
      )}
    </svg>
  );
}
