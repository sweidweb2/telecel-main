import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type FaqScrollerRow = {
  id: string;
  speed?: string;
  direction?: "left" | "right";
  faqItems: FaqItem[];
};

export type FaqSectionData = {
  mainTitle: string;
  mainSubtitle: string;
  rows: FaqScrollerRow[];
};

type FaqCardProps = {
  question: string;
  answer: string;
};

export function FaqCard({ question, answer }: FaqCardProps) {
  return (
    <article className="flex w-72 shrink-0 flex-col items-start gap-3 rounded-xl border bg-card p-5 shadow-sm sm:w-80 sm:gap-4 sm:p-6 md:w-96">
      <h3 className="font-heading text-lg font-semibold tracking-tight text-card-foreground sm:text-xl">
        {question}
      </h3>
      <p className="text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
        {answer}
      </p>
    </article>
  );
}

type HorizontalScrollerProps = {
  children: ReactNode;
  speed?: string;
  direction?: "left" | "right";
};

export function HorizontalScroller({
  children,
  speed = "40s",
  direction = "left",
}: HorizontalScrollerProps) {
  const animationClass =
    direction === "right"
      ? "animate-scroll-horizontal-reverse"
      : "animate-scroll-horizontal";

  const style = {
    "--scroll-duration": speed,
  } as CSSProperties;

  return (
    <div className="scroller-mask relative w-full overflow-hidden">
      <div
        className={cn(
          "flex motion-reduce:animate-none",
          animationClass,
        )}
        style={style}
      >
        <div className="flex shrink-0 items-stretch justify-center gap-4 px-2 sm:gap-6 sm:px-4">
          {children}
        </div>
        <div
          className="flex shrink-0 items-stretch justify-center gap-4 px-2 sm:gap-6 sm:px-4"
          aria-hidden="true"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

type FaqSectionProps = {
  data: FaqSectionData;
  className?: string;
  showHeading?: boolean;
};

export default function FaqSection({
  data,
  className,
  showHeading = false,
}: FaqSectionProps) {
  return (
    <div
      className={cn(
        "relative flex w-full max-w-6xl flex-col items-center px-0",
        showHeading ? "gap-8 sm:gap-10 md:gap-12" : "gap-6 sm:gap-8",
        className,
      )}
    >
      {showHeading ? (
        <div className="z-10 flex max-w-2xl flex-col items-center gap-4 text-center sm:gap-6">
          <h2 className="animate-fade-in-up font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            {data.mainTitle}
          </h2>
          <p className="animate-fade-in-up text-base text-muted-foreground [animation-delay:200ms] sm:text-lg">
            {data.mainSubtitle}
          </p>
        </div>
      ) : null}

      <div className="z-10 flex w-full flex-col gap-6 sm:gap-8">
        {data.rows.map((row) => (
          <HorizontalScroller
            key={row.id}
            speed={row.speed}
            direction={row.direction}
          >
            {row.faqItems.map((item) => (
              <FaqCard
                key={item.id}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </HorizontalScroller>
        ))}
      </div>
    </div>
  );
}
