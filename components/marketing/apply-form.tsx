"use client";

import { useRef, useTransition } from "react";
import Script from "next/script";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { submitInterestRegistration } from "@/actions/interest-registrations";
import type { ApplyLabels } from "@/components/marketing/apply-labels";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Locale } from "@/constants/locales";
import {
  TURNSTILE_APPLY_ACTION,
  type TurnstileWidgetId,
} from "@/types/turnstile";
import {
  interestRegistrationSchemaFor,
  type InterestRegistrationInput,
} from "@/validations/interest-registration";

type ApplyFormProps = {
  locale: Locale;
  labels: ApplyLabels;
};

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export function ApplyForm({ locale, labels }: ApplyFormProps) {
  const [isPending, startTransition] = useTransition();
  const turnstileContainer = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<TurnstileWidgetId | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<InterestRegistrationInput>({
    resolver: zodResolver(interestRegistrationSchemaFor(locale)),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      companyName: "",
      sector: "",
      country: "",
      pitch: "",
      consent: false,
      turnstileToken: "",
    },
  });

  const turnstileToken = useWatch({ control, name: "turnstileToken" });

  function clearTurnstileToken() {
    setValue("turnstileToken", "", { shouldValidate: false });
  }

  function resetTurnstileWidget() {
    if (turnstileWidgetId.current !== null && window.turnstile) {
      window.turnstile.reset(turnstileWidgetId.current);
    }
    clearTurnstileToken();
  }

  function renderTurnstile() {
    if (
      !TURNSTILE_SITE_KEY ||
      !turnstileContainer.current ||
      !window.turnstile ||
      turnstileWidgetId.current !== null
    ) {
      return;
    }

    turnstileWidgetId.current = window.turnstile.render(
      turnstileContainer.current,
      {
        sitekey: TURNSTILE_SITE_KEY,
        action: TURNSTILE_APPLY_ACTION,
        callback: (token) => {
          setValue("turnstileToken", token, { shouldValidate: true });
        },
        "error-callback": clearTurnstileToken,
        "expired-callback": clearTurnstileToken,
      },
    );
  }

  function onSubmit(values: InterestRegistrationInput) {
    startTransition(async () => {
      try {
        const result = await submitInterestRegistration(values);

        if (result.status === "error") {
          toast.error(result.message);
          return;
        }

        toast.success(result.message || labels.successToast);
        reset({
          fullName: "",
          email: "",
          phone: "",
          companyName: "",
          sector: "",
          country: "",
          pitch: "",
          consent: false,
          turnstileToken: "",
        });
      } finally {
        resetTurnstileWidget();
      }
    });
  }

  return (
    <>
      {TURNSTILE_SITE_KEY ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={renderTurnstile}
        />
      ) : null}
      <form
        className="grid gap-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="apply-fullName">{labels.nameLabel}</Label>
            <Input
              id="apply-fullName"
              type="text"
              autoComplete="name"
              placeholder={labels.namePlaceholder}
              aria-invalid={Boolean(errors.fullName)}
              disabled={isPending}
              className="min-h-11"
              {...register("fullName")}
            />
            {errors.fullName ? (
              <p className="text-sm text-destructive">
                {errors.fullName.message}
              </p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="apply-email">{labels.emailLabel}</Label>
            <Input
              id="apply-email"
              type="email"
              autoComplete="email"
              placeholder={labels.emailPlaceholder}
              aria-invalid={Boolean(errors.email)}
              disabled={isPending}
              className="min-h-11"
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="apply-phone">{labels.phoneLabel}</Label>
            <Input
              id="apply-phone"
              type="tel"
              autoComplete="tel"
              placeholder={labels.phonePlaceholder}
              aria-invalid={Boolean(errors.phone)}
              disabled={isPending}
              className="min-h-11"
              {...register("phone")}
            />
            {errors.phone ? (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="apply-companyName">{labels.companyLabel}</Label>
            <Input
              id="apply-companyName"
              type="text"
              autoComplete="organization"
              placeholder={labels.companyPlaceholder}
              aria-invalid={Boolean(errors.companyName)}
              disabled={isPending}
              className="min-h-11"
              {...register("companyName")}
            />
            {errors.companyName ? (
              <p className="text-sm text-destructive">
                {errors.companyName.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="apply-sector">{labels.sectorLabel}</Label>
            <Input
              id="apply-sector"
              type="text"
              placeholder={labels.sectorPlaceholder}
              aria-invalid={Boolean(errors.sector)}
              disabled={isPending}
              className="min-h-11"
              {...register("sector")}
            />
            {errors.sector ? (
              <p className="text-sm text-destructive">{errors.sector.message}</p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="apply-country">{labels.countryLabel}</Label>
            <Input
              id="apply-country"
              type="text"
              autoComplete="country-name"
              placeholder={labels.countryPlaceholder}
              aria-invalid={Boolean(errors.country)}
              disabled={isPending}
              className="min-h-11"
              {...register("country")}
            />
            {errors.country ? (
              <p className="text-sm text-destructive">{errors.country.message}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="apply-pitch">{labels.pitchLabel}</Label>
          <Textarea
            id="apply-pitch"
            rows={5}
            placeholder={labels.pitchPlaceholder}
            aria-invalid={Boolean(errors.pitch)}
            disabled={isPending}
            className="min-h-32"
            {...register("pitch")}
          />
          {errors.pitch ? (
            <p className="text-sm text-destructive">{errors.pitch.message}</p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Controller
            name="consent"
            control={control}
            render={({ field }) => (
              <div className="flex gap-3">
                <Checkbox
                  id="apply-consent"
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                  disabled={isPending}
                  aria-invalid={Boolean(errors.consent)}
                  className="mt-0.5 size-5"
                />
                <Label
                  htmlFor="apply-consent"
                  className="text-sm leading-snug font-normal"
                >
                  {labels.consentLabel}
                </Label>
              </div>
            )}
          />
          {errors.consent ? (
            <p className="text-sm text-destructive">{errors.consent.message}</p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <input type="hidden" {...register("turnstileToken")} />
          <div
            ref={turnstileContainer}
            className="min-h-16"
            data-testid="apply-turnstile"
          />
          {!turnstileToken && !errors.turnstileToken ? (
            <p className="text-sm text-muted-foreground">
              {labels.turnstileHint}
            </p>
          ) : null}
          {errors.turnstileToken ? (
            <p className="text-sm text-destructive">
              {errors.turnstileToken.message}
            </p>
          ) : null}
        </div>

        <Button
          type="submit"
          className="min-h-11 w-full sm:w-auto"
          disabled={isPending || !turnstileToken}
        >
          {isPending ? (
            <>
              <Loader2Icon className="animate-spin" />
              {labels.submittingLabel}
            </>
          ) : (
            labels.submitLabel
          )}
        </Button>
      </form>
    </>
  );
}
