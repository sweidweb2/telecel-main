"use client";

import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PLATFORM_STAGES } from "@/constants/home-content";
import { cn } from "@/lib/utils";

/**
 * Signature five-stage rail (Connect → Optimize). Keyboard-operable tabs
 * (arrow keys via Base UI); the selected station gets the red ring, bold
 * label and underline. Shows a sequence, not a technical dependency.
 */
export function PlatformRail({ className }: { className?: string }) {
  return (
    <Tabs
      defaultValue={PLATFORM_STAGES[0].key}
      className={cn("grid gap-10", className)}
    >
      {/* Below md the rail scrolls sideways instead of crushing the labels. */}
      <div className="-mx-5 overflow-x-auto px-5 pb-2 md:mx-0 md:overflow-visible md:px-0">
        <div className="relative min-w-[36rem] md:min-w-0">
          {/* Rail line behind the stations. */}
          <span
            aria-hidden
            className="absolute top-[11px] right-[10%] left-[10%] h-[1.5px] bg-ink/20"
          />
          <TabsList
            aria-label="Platform stages"
            className="relative grid h-auto w-full grid-cols-5 gap-0 rounded-none bg-transparent p-0"
          >
            {PLATFORM_STAGES.map((stage, index) => (
              <TabsTrigger
                key={stage.key}
                value={stage.key}
                className="group flex h-auto min-h-11 flex-col items-center gap-3 rounded-none border-0 bg-transparent px-1 py-0 text-center shadow-none after:hidden data-active:bg-transparent data-active:shadow-none dark:data-active:bg-transparent"
              >
                <span
                  aria-hidden
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full border-[1.5px] border-ink/30 bg-background transition-[border-color,box-shadow] duration-150",
                    "group-hover:border-ink group-data-active:border-brand group-data-active:shadow-[0_0_0_5px_color-mix(in_oklch,var(--brand),transparent_85%)]",
                    "group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-ring",
                  )}
                >
                  <span className="size-2 rounded-full bg-ink/30 transition-colors group-data-active:bg-brand" />
                </span>
                <span className="type-notation text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-heading text-base font-normal text-ink/70 decoration-brand decoration-2 underline-offset-[6px] group-hover:text-ink group-data-active:font-semibold group-data-active:text-ink group-data-active:underline sm:text-lg">
                  {stage.title}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </div>

      {PLATFORM_STAGES.map((stage, index) => (
        <TabsContent
          key={stage.key}
          value={stage.key}
          className="mt-0 grid gap-6 border-t pt-8 outline-none data-[hidden]:hidden md:grid-cols-12"
        >
          <p className="type-notation text-muted-foreground md:col-span-2">
            Stage {String(index + 1).padStart(2, "0")} / 05
          </p>
          <div className="md:col-span-7">
            <h3 className="font-heading text-2xl font-medium text-ink">
              {stage.title}
            </h3>
            <p className="mt-2 max-w-[60ch] text-lg leading-7 text-muted-foreground">
              {stage.summary}
            </p>
          </div>
          <div className="grid content-start gap-4 md:col-span-3">
            <ol aria-label="Sequence" className="grid gap-1.5">
              {PLATFORM_STAGES.map((step, stepIndex) => (
                <li
                  key={step.key}
                  aria-current={step.key === stage.key ? "step" : undefined}
                  className={cn(
                    "flex items-center gap-2 text-sm",
                    stepIndex < index && "text-ink",
                    stepIndex === index && "font-semibold text-ink",
                    stepIndex > index && "text-muted-foreground",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "size-2 rounded-full",
                      stepIndex < index && "bg-ink",
                      stepIndex === index && "bg-brand",
                      stepIndex > index && "border border-input",
                    )}
                  />
                  {step.title}
                </li>
              ))}
            </ol>
            <Link
              href={`/platform#${stage.key}`}
              className="group/link inline-flex min-h-11 items-center gap-2 font-medium text-ink underline decoration-hairline decoration-2 underline-offset-[6px] hover:decoration-brand"
            >
              How {stage.title.toLowerCase()} works
              <ArrowRightIcon className="size-4 transition-transform duration-150 group-hover/link:translate-x-0.5" />
            </Link>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
