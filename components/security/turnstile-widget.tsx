"use client";

import { useEffect, useRef } from "react";

import {
  TURNSTILE_CONTACT_ACTION,
  type TurnstileWidgetId,
} from "@/types/turnstile";

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileWidgetProps = {
  onToken: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  className?: string;
};

function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();

  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${SCRIPT_SRC}"]`
  );
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Turnstile script failed")), {
        once: true,
      });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Turnstile script failed"));
    document.head.appendChild(script);
  });
}

/**
 * Cloudflare Turnstile explicit render. Requires NEXT_PUBLIC_TURNSTILE_SITE_KEY.
 */
export function TurnstileWidget({
  onToken,
  onExpire,
  onError,
  className,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<TurnstileWidgetId | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        if (widgetIdRef.current) {
          window.turnstile.reset(widgetIdRef.current);
          return;
        }
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action: TURNSTILE_CONTACT_ACTION,
          callback: onToken,
          "expired-callback": () => onExpire?.(),
          "error-callback": () => onError?.(),
        });
      })
      .catch(() => onError?.());

    return () => {
      cancelled = true;
    };
  }, [siteKey, onToken, onExpire, onError]);

  if (!siteKey) {
    return (
      <p className="text-sm text-destructive" role="alert">
        Security check is not configured. Contact cannot be submitted yet.
      </p>
    );
  }

  return <div ref={containerRef} className={className} />;
}
