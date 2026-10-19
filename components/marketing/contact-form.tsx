"use client";

import { useRef, useTransition } from "react";
import Script from "next/script";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { submitContactMessage } from "@/actions/contact-messages";
import type { ContactLabels } from "@/components/marketing/contact-labels";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Locale } from "@/constants/locales";
import { TURNSTILE_CONTACT_ACTION } from "@/types/turnstile";
import type { TurnstileWidgetId } from "@/types/turnstile";
import {
  contactMessageSchemaFor,
  type ContactMessageInput,
} from "@/validations/contact-message";

type ContactFormProps = {
  locale: Locale;
  labels: ContactLabels;
};

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export function ContactForm({ locale, labels }: ContactFormProps) {
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
  } = useForm<ContactMessageInput>({
    resolver: zodResolver(contactMessageSchemaFor(locale)),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
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
        action: TURNSTILE_CONTACT_ACTION,
        callback: (token) => {
          setValue("turnstileToken", token, { shouldValidate: true });
        },
        "error-callback": clearTurnstileToken,
        "expired-callback": clearTurnstileToken,
      },
    );
  }

  function onSubmit(values: ContactMessageInput) {
    startTransition(async () => {
      try {
        const result = await submitContactMessage(values);

        if (result.status === "error") {
          toast.error(result.message);
          return;
        }

        toast.success(result.message || labels.successToast);
        reset({
          fullName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          turnstileToken: "",
        });
      } finally {
        resetTurnstileWidget();
      }
    });
  }

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>{labels.formTitle}</CardTitle>
        <CardDescription>{labels.formDescription}</CardDescription>
      </CardHeader>
      <CardContent>
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
              <Label htmlFor="contact-fullName">{labels.nameLabel}</Label>
              <Input
                id="contact-fullName"
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
              <Label htmlFor="contact-phone">{labels.phoneFieldLabel}</Label>
              <Input
                id="contact-phone"
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
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contact-email">{labels.emailFieldLabel}</Label>
            <Input
              id="contact-email"
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
          <div className="grid gap-2">
            <Label htmlFor="contact-subject">{labels.subjectLabel}</Label>
            <Input
              id="contact-subject"
              type="text"
              placeholder={labels.subjectPlaceholder}
              aria-invalid={Boolean(errors.subject)}
              disabled={isPending}
              className="min-h-11"
              {...register("subject")}
            />
            {errors.subject ? (
              <p className="text-sm text-destructive">{errors.subject.message}</p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contact-message">{labels.messageLabel}</Label>
            <Textarea
              id="contact-message"
              rows={5}
              placeholder={labels.messagePlaceholder}
              aria-invalid={Boolean(errors.message)}
              disabled={isPending}
              className="min-h-32"
              {...register("message")}
            />
            {errors.message ? (
              <p className="text-sm text-destructive">{errors.message.message}</p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <input type="hidden" {...register("turnstileToken")} />
            <div
              ref={turnstileContainer}
              className="min-h-16"
              data-testid="contact-turnstile"
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
      </CardContent>
    </Card>
  );
}
