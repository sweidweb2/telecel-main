import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ErrorScreenProps = {
  icon: LucideIcon;
  code?: string;
  title: string;
  description: string;
  tone?: "muted" | "destructive";
  children: ReactNode;
};

export function ErrorScreen({
  icon: Icon,
  code,
  title,
  description,
  tone = "muted",
  children,
}: ErrorScreenProps) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div
            className={cn(
              "mb-2 flex size-10 items-center justify-center rounded-lg",
              tone === "destructive" ? "bg-destructive/10" : "bg-muted",
            )}
          >
            <Icon
              className={cn(
                "size-5",
                tone === "destructive"
                  ? "text-destructive"
                  : "text-muted-foreground",
              )}
            />
          </div>
          {code ? (
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {code}
            </p>
          ) : null}
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">{children}</CardContent>
      </Card>
    </main>
  );
}
