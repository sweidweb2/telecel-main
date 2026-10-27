"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
  XIcon,
} from "lucide-react";

/**
 * App-wide toast host — mount once in `app/layout.tsx`.
 * Call `toast.success` / `toast.error` / `toast.warning` / `toast.info` from sonner.
 * Each toast is typed-colored and has an X dismiss control.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      richColors
      closeButton
      expand
      duration={4500}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
        close: <XIcon className="size-3.5" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "--success-bg":
            "color-mix(in oklab, var(--toast-success) 14%, var(--popover))",
          "--success-border":
            "color-mix(in oklab, var(--toast-success) 40%, var(--border))",
          "--success-text": "var(--toast-success)",
          "--info-bg":
            "color-mix(in oklab, var(--toast-info) 14%, var(--popover))",
          "--info-border":
            "color-mix(in oklab, var(--toast-info) 40%, var(--border))",
          "--info-text": "var(--toast-info)",
          "--warning-bg":
            "color-mix(in oklab, var(--toast-warning) 14%, var(--popover))",
          "--warning-border":
            "color-mix(in oklab, var(--toast-warning) 40%, var(--border))",
          "--warning-text": "var(--toast-warning)",
          "--error-bg":
            "color-mix(in oklab, var(--destructive) 14%, var(--popover))",
          "--error-border":
            "color-mix(in oklab, var(--destructive) 40%, var(--border))",
          "--error-text": "var(--destructive)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "cn-toast group toast border shadow-md !gap-3 !items-start !pr-10",
          title: "!text-sm !font-medium !leading-5",
          description: "!text-sm !opacity-90",
          icon: "!mt-0.5",
          success:
            "!bg-[var(--success-bg)] !border-[var(--success-border)] !text-[var(--success-text)]",
          info: "!bg-[var(--info-bg)] !border-[var(--info-border)] !text-[var(--info-text)]",
          warning:
            "!bg-[var(--warning-bg)] !border-[var(--warning-border)] !text-[var(--warning-text)]",
          error:
            "!bg-[var(--error-bg)] !border-[var(--error-border)] !text-[var(--error-text)]",
          loading: "!bg-popover !text-popover-foreground !border-border",
          closeButton:
            "!absolute !right-2 !top-2 !left-auto !size-7 !rounded-md !border !border-current/20 !bg-transparent !text-current opacity-80 transition-opacity hover:!opacity-100 hover:!bg-current/10 [&>svg]:!size-3.5",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
