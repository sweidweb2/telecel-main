import { Geist_Mono, Outfit } from "next/font/google";

/**
 * Placeholder brand typeface: Outfit is a free (OFL) geometric sans, matching
 * the RFQ's "clean geometric typography". Swap here once Telecel confirms the
 * licensed brand font (paid fonts need prior approval per RFQ §13).
 */
export const brandSans = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const brandMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});
