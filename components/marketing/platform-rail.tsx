"use client";

import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Heading } from "@/components/ui/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import {
  PLATFORM_STAGES,
  type PlatformStage,
} from "@/constants/platform-stages";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

/**
 * Signature five-stage rail (Connect → Optimize). Keyboard-operable tabs
 * (arrow keys via Base UI); the selected station gets the red ring, bold
 * label and underline. Shows a sequence, not a technical dependency.
 *
 * Stage keys are real DOM ids so `/platform#connect` (and siblings) resolve.
 * On the platform route the hash also selects the matching tab.
 */
type PlatformRailProps = {
  className?: string;
  /** Defaults to the shared Connect → Optimize sequence. */
  stages?: readonly PlatformStage[];
};

function stageKeyFromHash(
  hash: string,
  stages: readonly PlatformStage[],
): PlatformStage["key"] | null {
  const id = hash.replace(/^#/, "");
  return stages.some((stage) => stage.key === id)
    ? (id as PlatformStage["key"])
    : null;
}

export function PlatformRail({
  className,
  stages = PLATFORM_STAGES,
}: PlatformRailProps) {
  const fallback = stages[0]?.key;
  const [value, setValue] = useState<string | undefined>(fallback);

  useEffect(() => {
    const applyHash = () => {
      const key = stageKeyFromHash(window.location.hash, stages);
      if (key) setValue(key);
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [stages]);

  const handleValueChange = (next: string | number | null) => {
    if (typeof next !== "string") return;
    setValue(next);
    if (
      typeof window !== "undefined" &&
      window.location.pathname === ROUTES.platform &&
      stages.some((stage) => stage.key === next)
    ) {
      window.history.replaceState(null, "", `${ROUTES.platform}#${next}`);
    }
  };

  return (
    <div className={cn("relative", className)}>
      {/* Always-present anchors so nav hashes land even when a panel is hidden. */}
      {stages.map((stage) => (
        <span
          key={`anchor-${stage.key}`}
          id={stage.key}
          className="pointer-events-none absolute top-0 h-0 w-0 scroll-mt-28"
          aria-hidden
        />
      ))}

      <Tabs
        value={value}
        onValueChange={handleValueChange}
        className="grid gap-10"
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
              {stages.map((stage, index) => (
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
                  <Heading
                    level="label"
                    as="span"
                    className="text-base font-normal text-ink/70 decoration-brand decoration-2 underline-offset-[6px] group-hover:text-ink group-data-active:font-semibold group-data-active:text-ink group-data-active:underline sm:text-lg"
                  >
                    {stage.title}
                  </Heading>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {stages.map((stage, index) => (
          <TabsContent
            key={stage.key}
            value={stage.key}
            className="mt-0 grid gap-6 border-t pt-8 outline-none data-[hidden]:hidden md:grid-cols-12"
          >
            <p className="type-notation text-muted-foreground md:col-span-2">
              Stage {String(index + 1).padStart(2, "0")} / 05
            </p>
            <div className="md:col-span-7">
              <Heading level="subtitle">{stage.title}</Heading>
              <Text variant="lead" className="mt-2 max-w-[60ch]">
                {stage.summary}
              </Text>
            </div>
            <div className="grid content-start gap-4 md:col-span-3">
              <ol aria-label="Sequence" className="grid gap-1.5">
                {stages.map((step, stepIndex) => (
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
                href={`${ROUTES.platform}#${stage.key}`}
                className="group/link inline-flex min-h-11 items-center gap-2 font-medium text-ink underline decoration-hairline decoration-2 underline-offset-[6px] hover:decoration-brand"
              >
                How {stage.title.toLowerCase()} works
                <ArrowRightIcon className="size-4 transition-transform duration-150 group-hover/link:translate-x-0.5" />
              </Link>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
