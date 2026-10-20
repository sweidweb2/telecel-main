import { IBM_Plex_Mono, IBM_Plex_Sans, Jost } from "next/font/google";

/**
 * "Connected Energies" type system (all OFL, no licence cost — RFQ §13):
 * - Jost: geometric display face for headings (echoes the rounded wordmark).
 * - IBM Plex Sans: reading/UI face for body copy and the CMS.
 * - IBM Plex Mono: notation only (stage indices, reference labels).
 * Never typeset the Telecel wordmark in any of these; use the supplied logo.
 */
export const displayFont = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

export const bodyFont = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const monoFont = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const fontVariables = [
  displayFont.variable,
  bodyFont.variable,
  monoFont.variable,
].join(" ");
