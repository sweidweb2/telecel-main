import localFont from "next/font/local";

/**
 * "Connected Energies" type system (all OFL, no licence cost — RFQ §13):
 * - Jost: geometric display face for headings (echoes the rounded wordmark).
 * - IBM Plex Sans: reading/UI face for body copy and the CMS.
 * - IBM Plex Mono: notation only (stage indices, reference labels).
 * Never typeset the Telecel wordmark in any of these; use the supplied logo.
 *
 * Latin WOFF2 files live in `assets/fonts/` (OFL texts alongside them).
 * They are loaded with `next/font/local` so compile does not download
 * Google Fonts — a failed download is reported as a missing
 * `@vercel/turbopack-next/internal/font/google/font` module.
 */
export const displayFont = localFont({
  src: [
    {
      path: "../assets/fonts/jost-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/jost-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-jost",
  display: "swap",
  adjustFontFallback: "Arial",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const bodyFont = localFont({
  src: [
    {
      path: "../assets/fonts/ibm-plex-sans-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/ibm-plex-sans-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/ibm-plex-sans-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-plex-sans",
  display: "swap",
  adjustFontFallback: "Arial",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const monoFont = localFont({
  src: "../assets/fonts/ibm-plex-mono-latin-400-normal.woff2",
  variable: "--font-plex-mono",
  weight: "400",
  style: "normal",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["ui-monospace", "monospace"],
});

export const fontVariables = [
  displayFont.variable,
  bodyFont.variable,
  monoFont.variable,
].join(" ");
