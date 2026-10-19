import Image from "next/image";

import type { PortfolioStartup } from "@/types/portfolio-startup";
import { cn } from "@/lib/utils";

type StartupCardProps = {
  startup: PortfolioStartup;
  className?: string;
};

export function StartupCard({ startup, className }: StartupCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-muted">
        <Image
          src={startup.imageUrl}
          alt={startup.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-5 sm:p-6">
        <h3 className="font-heading text-lg font-semibold leading-snug tracking-tight text-balance sm:text-xl">
          {startup.name}
        </h3>
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
          {startup.description}
        </p>
      </div>
    </article>
  );
}
