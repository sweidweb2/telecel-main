import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { SignalMotif } from "@/components/brand/signal-motif";
import { cn } from "@/lib/utils";

type ErrorScreenProps = {
  icon: LucideIcon;
  code?: string;
  title: string;
  description: string;
  tone?: "muted" | "destructive";
  children: ReactNode;
};

/** Shared 400/401/403/404/500 layout: notation code, display title, actions, motif. */
export function ErrorScreen({
  icon: Icon,
  code,
  title,
  description,
  tone = "muted",
  children,
}: ErrorScreenProps) {
  return (
    <main className="container-site flex flex-1 items-center gap-12 py-16 lg:py-24">
      <SignalMotif rows={8} className="hidden h-64 w-auto md:block" />
      <div className="max-w-xl">
        <p
          className={cn(
            "flex items-center gap-2 type-notation",
            tone === "destructive" ? "text-destructive" : "text-muted-foreground"
          )}
        >
          <Icon className="size-4" aria-hidden />
          {code ?? "Notice"}
        </p>
        <h1 className="mt-4 type-section text-ink">{title}</h1>
        <p className="mt-4 text-lg leading-7 text-muted-foreground">{description}</p>
        <div className="mt-8 flex flex-wrap gap-3 [&>*]:w-auto">{children}</div>
      </div>
    </main>
  );
}
