import Image from "next/image";

import { cn } from "@/lib/utils";

const HAS_BRAND_LOGO = process.env.NEXT_PUBLIC_HAS_BRAND_LOGO === "true";

/** Rendered heights in px; source artwork is 1003×274 (mark + wordmark). */
const HEIGHTS = { sm: 32, md: 42, lg: 56 } as const;

type LogoProps = {
  className?: string;
  size?: keyof typeof HEIGHTS;
  /**
   * "reversed" was meant for dark surfaces (footer). Do not CSS-invert the
   * artwork — the mark’s white “t” becomes a solid white disc. Use the colour
   * lockup on charcoal; a true mono asset can replace this later.
   */
  variant?: "color" | "reversed";
  priority?: boolean;
};

/**
 * Official Telecel Global Services lockup (mark + "telecel" + "Global Services").
 * Never retype the wordmark in a web font. When the confidential artwork is
 * not present locally (see public/brand/README.md) a neutral text label is
 * shown instead, clearly not an imitation of the logo.
 */
export function Logo({
  className,
  size = "md",
  variant = "color",
  priority,
}: LogoProps) {
  const height = HEIGHTS[size];

  if (!HAS_BRAND_LOGO) {
    return (
      <span
        className={cn(
          "inline-flex items-center font-heading text-lg font-semibold tracking-tight",
          variant === "reversed" ? "text-white" : "text-ink",
          className,
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
      alt="Telecel Global Services"
      width={1003}
      height={274}
      priority={priority}
      unoptimized
      className={cn("w-auto select-none", className)}
      style={{ height }}
    />
  );
}
