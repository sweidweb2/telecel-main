import Image from "next/image";

import { cn } from "@/lib/utils";

const HAS_BRAND_LOGO = process.env.NEXT_PUBLIC_HAS_BRAND_LOGO === "true";

/** Rendered heights in px; the source artwork is 248×84 (wordmark + tagline). */
const HEIGHTS = { sm: 32, md: 42, lg: 56 } as const;

type LogoProps = {
  className?: string;
  size?: keyof typeof HEIGHTS;
  /** "reversed" = single-colour white for dark surfaces (footer, CMS sidebar). */
  variant?: "color" | "reversed";
  priority?: boolean;
};

/**
 * Official Telecel wordmark ("telecel" + "Connecting Energies").
 * Never retype the wordmark in a web font. When the confidential artwork is
 * not present locally (see public/brand/README.md) a neutral text label is
 * shown instead, clearly not an imitation of the logo.
 */
export function Logo({ className, size = "md", variant = "color", priority }: LogoProps) {
  const height = HEIGHTS[size];

  if (!HAS_BRAND_LOGO) {
    return (
      <span
        className={cn(
          "inline-flex items-center font-heading text-lg font-semibold tracking-tight",
          variant === "reversed" ? "text-white" : "text-ink",
          className
        )}
        style={{ height }}
      >
        Telecel Global
      </span>
    );
  }

  return (
    <Image
      src="/brand/telecel-wordmark.png"
      alt="Telecel — Connecting Energies"
      width={248}
      height={84}
      priority={priority}
      unoptimized
      className={cn(
        "w-auto select-none",
        variant === "reversed" && "brightness-0 invert",
        className
      )}
      style={{ height }}
    />
  );
}
