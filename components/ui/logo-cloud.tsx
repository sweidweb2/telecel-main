import Image from "next/image";

import type { PartnerLogo } from "@/constants/partner-logos";
import { cn } from "@/lib/utils";

type LogoCloudGridProps = {
  logos: PartnerLogo[];
  className?: string;
};

export function LogoCloudGrid({ logos, className }: LogoCloudGridProps) {
  return (
    <ul
      className={cn(
        "mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-8 sm:gap-x-14 sm:gap-y-10",
        className,
      )}
    >
      {logos.map((logo) => (
        <li key={logo.name}>
          <Image
            src={logo.src}
            alt={`${logo.name} logo`}
            width={120}
            height={logo.height}
            className={cn("w-fit dark:invert", logo.className ?? "h-5")}
          />
        </li>
      ))}
    </ul>
  );
}

type LogoCloudProps = {
  title?: string;
  logos: PartnerLogo[];
  id?: string;
  className?: string;
};

export default function LogoCloud({
  title,
  logos,
  id = "partners",
  className,
}: LogoCloudProps) {
  return (
    <section id={id} className={cn("scroll-mt-20 bg-background py-12 sm:py-16", className)}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {title ? (
          <h2 className="text-center text-base font-medium text-balance sm:text-lg">
            {title}
          </h2>
        ) : null}
        <LogoCloudGrid
          logos={logos}
          className={title ? "mt-12 sm:mt-16" : undefined}
        />
      </div>
    </section>
  );
}
