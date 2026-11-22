"use client";

import {
  useCallback,
  useEffect,
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

import {
  PLATFORM_LAYERS,
  type PlatformLayerIcon,
} from "@/constants/platform-layers";
import { cn } from "@/lib/utils";

const LAYER_COUNT = PLATFORM_LAYERS.length;
const AUTOPLAY_MS = 3000;
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

/** Packed plates fade downward for depth. */
function inactiveFaceAlpha(packIndex: number): number {
  return 0.72 - packIndex * 0.07;
}

type PlatformLayersInteractiveProps = {
  labelledBy: string;
};

/**
 * Interactive isometric stack + list. Hover/click/keyboard select a layer;
 * auto-plays every 3s until paused. Shell chrome stays in the server parent.
 */
export function PlatformLayersInteractive({
  labelledBy,
}: PlatformLayersInteractiveProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectIndex = useCallback((index: number) => {
    setActiveIndex(((index % LAYER_COUNT) + LAYER_COUNT) % LAYER_COUNT);
    setProgressKey((key) => key + 1);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % LAYER_COUNT);
      setProgressKey((key) => key + 1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [isPaused]);

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
    <div
      className="mt-12 flex flex-col items-center gap-12 lg:mt-16 lg:flex-row lg:items-center lg:justify-center lg:gap-24"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setIsPaused(false);
        }
      }}
    >
      {/* Isometric plate stack — visual mirror of the list; a11y lives in the rows. */}
      <div
        aria-hidden
        className="relative flex w-full max-w-2xl shrink-0 justify-center scale-[0.58] sm:scale-[0.75] lg:w-[36rem] lg:scale-100"
      >
        <div className="pointer-events-none absolute bottom-[6%] left-1/2 h-20 w-[80%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgb(0_0_0_/_0.14),transparent_70%)] blur-md" />

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
              const { offsetY, packIndex, zIndex } = plateLayout(
                index,
                activeIndex,
              );
              const faceAlpha = isActive
                ? 1
                : inactiveFaceAlpha(Math.max(packIndex, 0));

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
                    transition: `transform 500ms ${EASE_LIFT}`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <span
                    className={cn(
                      "pointer-events-none absolute inset-[-20%] rounded-[40px] transition-opacity duration-500",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 60%, rgba(227, 6, 19, 0.35), transparent 68%)",
                      filter: "blur(40px)",
                      transform: `translateZ(-${PLATE_DEPTH_PX + 8}px)`,
                      transitionTimingFunction: EASE_LIFT,
                    }}
                  />

                  <span
                    className="absolute inset-0 rounded-[28px] transition-[background-color] duration-500"
                    style={{
                      transform: `translateZ(-${PLATE_DEPTH_PX}px)`,
                      background: isActive
                        ? "#9E000C"
                        : `rgba(230, 230, 230, ${Math.max(faceAlpha - 0.15, 0.35)})`,
                      transitionTimingFunction: EASE_LIFT,
                    }}
                  />

                  <span
                    className={cn(
                      "absolute inset-0 flex items-center justify-center rounded-[28px] border transition-[background,border-color,box-shadow] duration-500",
                      isActive
                        ? "border-transparent"
                        : "border-[rgba(0,0,0,0.08)]",
                    )}
                    style={{
                      transform: "translateZ(0)",
                      background: isActive
                        ? "linear-gradient(145deg, #E30613 0%, #B8000F 100%)"
                        : `rgba(255, 255, 255, ${faceAlpha})`,
                      boxShadow: isActive
                        ? "inset 0 1px 0 rgba(255, 255, 255, 0.22)"
                        : "0 10px 30px rgba(0, 0, 0, 0.06)",
                      transitionTimingFunction: EASE_LIFT,
                    }}
                  >
                    <Icon
                      className={cn(
                        "size-11 text-white transition-[opacity,transform] duration-500",
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

      <div className="w-full min-w-0 max-w-lg lg:max-w-md">
        <div
          role="group"
          aria-labelledby={labelledBy}
          className="rounded-[20px] border border-hairline bg-white p-2 shadow-[0_18px_48px_rgb(23_23_23_/_0.08)]"
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
                      "relative flex w-full min-h-12 items-center justify-between gap-3 overflow-hidden rounded-[14px] px-4 py-3.5 text-left transition-[background-color,color,box-shadow] duration-500",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                      isActive
                        ? "bg-surface shadow-[inset_0_0_0_1px_var(--hairline)]"
                        : "bg-transparent hover:bg-surface/70",
                    )}
                    style={{ transitionTimingFunction: EASE_LIFT }}
                  >
                    <span
                      className={cn(
                        "text-base font-semibold tracking-tight transition-colors duration-500",
                        isActive ? "text-brand" : "text-ink",
                      )}
                      style={{ transitionTimingFunction: EASE_LIFT }}
                    >
                      {layer.title}
                    </span>
                    <span className="shrink-0 text-sm text-muted-foreground">
                      {layer.tag}
                    </span>
                    {isActive ? (
                      <span
                        key={progressKey}
                        aria-hidden
                        className={cn(
                          "pointer-events-none absolute right-4 bottom-2 left-4 h-0.5 origin-left rounded-full bg-[#E30613]",
                          isPaused && "[animation-play-state:paused]",
                        )}
                        style={{
                          animation: `platform-layer-progress ${AUTOPLAY_MS}ms linear forwards`,
                        }}
                      />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <p
          key={activeLayer.key}
          className="mt-5 min-h-[3rem] text-sm leading-6 text-muted-foreground motion-safe:animate-[fade-in-up_500ms_var(--ease-standard)_both]"
        >
          {activeLayer.description}
        </p>
      </div>
    </div>
  );
}
