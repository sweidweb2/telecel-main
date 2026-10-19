import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageHero({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string }) {
  return (
    <section className="border-b bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
        {eyebrow ? <p className="mb-3 text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">{eyebrow}</p> : null}
        <h1 className="max-w-3xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{description}</p>
      </div>
    </section>
  );
}

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn("mx-auto w-full max-w-6xl px-4 py-14 sm:py-20", className)}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-8 max-w-2xl", className)}>
      {eyebrow ? <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{eyebrow}</p> : null}
      <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      {description ? <p className="mt-3 leading-7 text-muted-foreground">{description}</p> : null}
    </div>
  );
}

export function MediaPlaceholder({ label, className }: { label: string; className?: string }) {
  return (
    <div className={cn("flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed bg-muted/40 p-6 text-center text-sm text-muted-foreground", className)}>
      {label}
    </div>
  );
}

export function DraftNotice() {
  return <p className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">Draft structure — final copy, imagery, names, and figures require Telecel approval.</p>;
}
