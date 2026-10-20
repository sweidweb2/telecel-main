import Link from "next/link";

import { SERVICE_PILLARS } from "@/constants/home-content";
import { cn } from "@/lib/utils";

/**
 * Hero diagram: the five service pillars joining one route into "One Global
 * B2B Platform". Honest by construction — a labelled portfolio diagram, not
 * telemetry, geography or deployed topology (RFQ §6: no fake dashboards).
 * Built in HTML/CSS so labels stay real, selectable, accessible text.
 */
export function ServicePortfolioDiagram({ className }: { className?: string }) {
  return (
    <figure className={cn("relative", className)}>
      <figcaption className="mb-5 text-sm font-medium text-muted-foreground">
        Service portfolio
      </figcaption>
      <ol className="relative">
        {/* Bus: rows are h-14 (56px). Grey trunk joins pillar 01→05 (centres at
            28px…252px); the single red route runs from 05 into the platform. */}
        <span aria-hidden className="absolute top-7 right-0 h-56 w-[1.5px] bg-ink/25" />
        <span aria-hidden className="absolute top-[252px] right-0 h-[58px] w-[1.5px] bg-brand" />
        {SERVICE_PILLARS.map((pillar) => (
          <li key={pillar.slug} className="relative">
            <Link
              href={`/services/${pillar.slug}`}
              className="group grid h-14 grid-cols-[auto_1fr] items-center gap-3 outline-none"
            >
              <span className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="size-3 rounded-full border-[1.5px] border-ink/40 bg-background transition-colors duration-150 group-hover:border-brand group-hover:bg-brand group-focus-visible:border-brand"
                />
                <span className="text-base font-medium text-ink underline-offset-4 group-hover:underline group-focus-visible:underline">
                  {pillar.title}
                </span>
              </span>
              {/* Route into the bus, with a junction node. */}
              <span aria-hidden className="relative ml-2 h-[1.5px] bg-ink/25 transition-colors duration-150 group-hover:bg-ink/60">
                <span className="absolute -top-[3.25px] -right-[3.5px] size-2 rounded-full bg-ink/40" />
              </span>
            </Link>
          </li>
        ))}
        <li className="relative mt-4 [&>div]:h-7">
          <div className="grid grid-cols-[auto_1fr] items-center gap-3">
            <span className="flex items-center gap-3">
              <span
                aria-hidden
                className="size-4 rounded-full bg-brand ring-[6px] ring-brand/12"
              />
              <span className="font-heading text-xl font-semibold tracking-tight text-ink">
                One Global B2B Platform
              </span>
            </span>
            <span aria-hidden className="ml-2 h-[1.5px] bg-brand" />
          </div>
          <p className="mt-2 pl-7 type-notation text-muted-foreground">
            Connect · Orchestrate · Deliver · Monitor · Optimize
          </p>
        </li>
      </ol>
    </figure>
  );
}
