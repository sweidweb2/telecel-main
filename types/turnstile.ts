/** Stable Turnstile `data-action` for the public contact form. */
export const TURNSTILE_CONTACT_ACTION = "contact";

export type TurnstileWidgetId = string;

export type TurnstileRenderOptions = {
  sitekey: string;
  action: string;
  callback: (token: string) => void;
  "error-callback"?: () => void;
  "expired-callback"?: () => void;
};

export type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: TurnstileRenderOptions,
  ) => TurnstileWidgetId;
  reset: (widgetId: TurnstileWidgetId) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export {};
