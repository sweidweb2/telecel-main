"use client";

import {
  useCallback,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  CloudIcon,
  CpuIcon,
  GlobeIcon,
  MessageSquareIcon,
  ShieldIcon,
  type LucideIcon,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import {
  PLATFORM_LAYERS,
  type PlatformLayerIcon,
} from "@/constants/platform-layers";
import { cn } from "@/lib/utils";

const LAYER_COUNT = PLATFORM_LAYERS.length;
const EASE_LIFT = "cubic-bezier(0.22, 1, 0.36, 1)";
/** Tight centre-to-centre gap for the packed inactive stack. */
const PLATE_GAP_PX = 16;
/** Clear space under the selected plate before the packed stack. */
const ACTIVE_CLEARANCE_PX = 56;
/** Slab depth (translateZ) — visible edge thickness. */
const PLATE_DEPTH_PX = 22;
const PLATE_SIZE_REM = 18;
/** Top slot for the selected plate (negative = higher on screen). */
const ACTIVE_TOP_Y = -72;
/** Packed stack starts just under the active clearance. */
const PACK_START_Y = ACTIVE_TOP_Y + ACTIVE_CLEARANCE_PX;

const LAYER_ICONS: Record<PlatformLayerIcon, LucideIcon> = {
  globe: GlobeIcon,
  message: MessageSquareIcon,
  cloud: CloudIcon,
  chip: CpuIcon,
  shield: ShieldIcon,
};

type PlatformLayersProps = {
  className?: string;
};

/**
 * Selected plate always takes the top slot; the rest pack tightly below
 * with clearance under the active plate. Pack order keeps original index order.
 */
function plateLayout(index: number, activeIndex: number) {
  if (index === activeIndex) {
    return { offsetY: ACTIVE_TOP_Y, packIndex: -1, zIndex: LAYER_COUNT + 1 };
  }

  let packIndex = 0;
  for (let i = 0; i < index; i += 1) {
    if (i !== activeIndex) packIndex += 1;
  }

  return {
    offsetY: PACK_START_Y + packIndex * PLATE_GAP_PX,
    packIndex,
    zIndex: LAYER_COUNT - packIndex,
  };
}

/**
 * Interactive isometric “five platform layers” stack + list.
 * Hover/click/keyboard select a layer. Nothing auto-advances (DESIGN.md).
 */
export function PlatformLayers({ className }: PlatformLayersProps) {
  const labelId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectIndex = useCallback((index: number) => {
    setActiveIndex(((index % LAYER_COUNT) + LAYER_COUNT) % LAYER_COUNT);
  }, []);

  const focusIndex = (index: number) => {
    selectIndex(index);
    buttonRefs.current[index]?.focus();
  };

  const onRowKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      focusIndex((index + 1) % LAYER_COUNT);
      return;
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      focusIndex((index - 1 + LAYER_COUNT) % LAYER_COUNT);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      focusIndex(0);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      focusIndex(LAYER_COUNT - 1);
    }
  };

  const activeLayer = PLATFORM_LAYERS[activeIndex];

  return (
    <Section id="layers" tone="surface" bleed className={className}>
      <Container className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[40rem] text-center lg:max-w-none">
          <Text variant="notation">Platform</Text>
          <Heading level="section" as="h2" id={labelId} className="mt-3">
            Five platform layers
          </Heading>
          <Text variant="lead" className="mx-auto mt-4 max-w-[48ch]">
            Connectivity, messaging, cloud, IoT and security — one managed stack
            for operators, enterprises and partners.
          </Text>
        </div>

        <div className="mt-12 flex flex-col items-center gap-12 lg:mt-16 lg:flex-row lg:items-center lg:justify-center lg:gap-24">
          {/* Isometric plate stack — visual mirror of the list; a11y lives in the rows. */}
          <div
            aria-hidden
            className="relative flex w-full max-w-2xl shrink-0 justify-center scale-[0.58] sm:scale-[0.75] lg:w-[36rem] lg:scale-100"
          >
            <div
              className="relative h-[36rem] w-[28rem]"
              style={{ perspective: "1200px" }}
            >
              <div
                className="absolute inset-0"
                style={{ transformStyle: "preserve-3d" }}
              >
                {PLATFORM_LAYERS.map((layer, index) => {
                  const isActive = index === activeIndex;
                  const Icon = LAYER_ICONS[layer.icon];
                  const { offsetY, zIndex } = plateLayout(index, activeIndex);

                  return (
                    <button
                      key={layer.key}
                      type="button"
                      tabIndex={-1}
                      onClick={() => selectIndex(index)}
                      className="absolute top-1/2 left-1/2 cursor-pointer border-0 bg-transparent p-0"
                      style={{
                        width: `${PLATE_SIZE_REM}rem`,
                        height: `${PLATE_SIZE_REM}rem`,
                        zIndex,
                        transform: `translate(-50%, calc(-50% + ${offsetY}px)) rotateX(55deg) rotateZ(-45deg)`,
                        transition: `transform 200ms ${EASE_LIFT}`,
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {/* Thickness — same footprint as the face, pushed back in Z only */}
                      <span
                        className="absolute inset-0 rounded-[28px] transition-[background-color] duration-200"
                        style={{
                          transform: `translateZ(-${PLATE_DEPTH_PX}px)`,
                          background: isActive
                            ? "var(--ink)"
                            : "var(--hairline)",
                          transitionTimingFunction: EASE_LIFT,
                        }}
                      />

                      {/* Face */}
                      <span
                        className={cn(
                          "absolute inset-0 flex items-center justify-center rounded-[28px] border-2 transition-[border-color] duration-200",
                          isActive ? "border-brand" : "border-hairline",
                        )}
                        style={{
                          transform: "translateZ(0)",
                          background: "var(--background)",
                          transitionTimingFunction: EASE_LIFT,
                        }}
                      >
                        <Icon
                          className={cn(
                            "size-11 text-brand transition-[opacity,transform] duration-200",
                            isActive
                              ? "scale-100 opacity-100"
                              : "scale-[0.8] opacity-0",
                          )}
                          style={{ transitionTimingFunction: EASE_LIFT }}
                          strokeWidth={1.5}
                        />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Layer list card */}
          <div className="w-full min-w-0 max-w-lg lg:max-w-md">
            <div
              role="group"
              aria-labelledby={labelId}
              className="rounded-[20px] border border-hairline bg-background p-2"
            >
              <ul className="flex flex-col gap-0.5">
                {PLATFORM_LAYERS.map((layer, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <li key={layer.key}>
                      <button
                        ref={(node) => {
                          buttonRefs.current[index] = node;
                        }}
                        type="button"
                        aria-pressed={isActive}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => selectIndex(index)}
                        onMouseEnter={() => selectIndex(index)}
                        onKeyDown={(event) => onRowKeyDown(event, index)}
                        className={cn(
                          "relative flex w-full min-h-12 items-center justify-between gap-3 overflow-hidden rounded-[14px] px-4 py-3.5 text-left transition-[background-color,color] duration-200",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                          isActive
                            ? "bg-surface shadow-[inset_0_0_0_1px_var(--hairline)]"
                            : "bg-transparent hover:bg-surface/70",
                        )}
                        style={{ transitionTimingFunction: EASE_LIFT }}
                      >
                        <span
                          className={cn(
                            "text-base font-semibold tracking-tight transition-colors duration-200",
                            isActive ? "text-brand" : "text-ink",
                          )}
                          style={{ transitionTimingFunction: EASE_LIFT }}
                        >
                          {layer.title}
                        </span>
                        <span className="shrink-0 text-sm text-muted-foreground">
                          {layer.tag}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <p
              key={activeLayer.key}
              aria-live="polite"
              className="mt-5 min-h-[3rem] text-sm leading-6 text-muted-foreground motion-safe:animate-[fade-in-up_200ms_var(--ease-standard)_both]"
            >
              {activeLayer.description}
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
