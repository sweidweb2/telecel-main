import type { ReactNode } from "react";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";

/** Centered card used by every CMS auth screen. */
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
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-10 sm:py-16">
      <Link href={ROUTES.home} aria-label="Telecel Global home">
        <Logo />
      </Link>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            <h1>{title}</h1>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {notice}
          {children}
        </CardContent>
      </Card>
      {footer ? (
        <div className="text-center text-sm text-muted-foreground">{footer}</div>
      ) : null}
    </main>
  );
}

export function AuthNotice({
  tone = "info",
  children,
}: {
  tone?: "info" | "error";
  children: ReactNode;
}) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={
        tone === "error"
          ? "rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          : "rounded-lg border bg-muted/50 px-3 py-2 text-sm text-muted-foreground"
      }
    >
      {children}
    </p>
  );
}
