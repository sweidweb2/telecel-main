import type { ReactNode } from "react";
import Link from "next/link";
import { CircleAlertIcon, InfoIcon } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { SignalMotif } from "@/components/brand/signal-motif";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

/**
 * CMS auth layout (40/60): pale brand panel with the official logo and one
 * static motif crop; unboxed 400px form on white. The panel is dropped on
 * mobile so the form comes first.
 */
export function AuthShell({
  title,
  description,
  notice,
  children,
  footer,
}: {
  title: string;
  description: string;
  notice?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="grid flex-1 lg:grid-cols-[2fr_3fr]">
      <aside className="relative hidden overflow-hidden border-r bg-surface lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Link href={ROUTES.home} aria-label="Telecel Global website" className="w-fit">
          <Logo size="lg" priority />
        </Link>
        <div className="relative z-10 max-w-sm">
          <p className="type-notation text-muted-foreground">Telecel Global · CMS</p>
          <p className="mt-4 max-w-[24ch] font-heading text-2xl leading-8 font-medium tracking-tight text-ink">
            Manage the platform story, services and every sales inquiry in one place.
          </p>
        </div>
        <SignalMotif
          rows={8}
          className="absolute top-[42%] right-10 h-64 w-auto -translate-y-1/2"
        />
      </aside>

      <section className="flex flex-col px-5 py-10 sm:px-10 lg:justify-center lg:px-20">
        <Link href={ROUTES.home} aria-label="Telecel Global website" className="mx-auto mb-12 w-full max-w-[400px] lg:hidden">
          <Logo size="md" priority />
        </Link>
        <div className="mx-auto w-full max-w-[400px]">
          <h1 className="font-heading text-[2rem] leading-[2.4rem] font-medium tracking-tight text-ink">
            {title}
          </h1>
          <p className="mt-2 text-base text-muted-foreground">{description}</p>
          {notice ? <div className="mt-8">{notice}</div> : null}
          <div className="mt-8">{children}</div>
          {footer ? <div className="mt-8 text-sm text-muted-foreground">{footer}</div> : null}
        </div>
      </section>
    </main>
  );
}

/** Inline notice: icon + text + left rule, so status never relies on colour alone. */
export function AuthNotice({
  tone = "info",
  children,
}: {
  tone?: "info" | "error";
  children: ReactNode;
}) {
  const Icon = tone === "error" ? CircleAlertIcon : InfoIcon;
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex gap-3 border-l-2 py-1 pl-3 text-sm leading-5",
        tone === "error" ? "border-destructive text-destructive" : "border-ink text-ink"
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  );
}
