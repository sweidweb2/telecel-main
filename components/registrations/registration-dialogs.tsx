"use client";

import { useId, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useRouter } from "nextjs-toploader/app";
import {
  EyeIcon,
  Loader2Icon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import {
  deleteInterestRegistration,
  updateInterestRegistration,
} from "@/actions/interest-registrations";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { InterestRegistration } from "@/types/interest-registration";
import {
  INTEREST_REGISTRATION_COMPANY_MAX,
  INTEREST_REGISTRATION_COUNTRY_MAX,
  INTEREST_REGISTRATION_EMAIL_MAX,
  INTEREST_REGISTRATION_FULL_NAME_MAX,
  INTEREST_REGISTRATION_PHONE_MAX,
  INTEREST_REGISTRATION_PITCH_MAX,
  INTEREST_REGISTRATION_SECTOR_MAX,
  updateInterestRegistrationSchema,
  type UpdateInterestRegistrationInput,
} from "@/validations/interest-registration";

function FormFieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <FieldError>{message}</FieldError>;
}

function toEditDefaults(
  registration: InterestRegistration,
): UpdateInterestRegistrationInput {
  return {
    id: registration.id,
    fullName: registration.full_name,
    email: registration.email,
    phone: registration.phone,
    companyName: registration.company_name,
    sector: registration.sector,
    country: registration.country,
    pitch: registration.pitch,
  };
}

export function RegistrationRowActions({
  registration,
}: {
  registration: InterestRegistration;
}) {
  const editFormId = useId();
  const router = useRouter();
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isUpdating, startUpdate] = useTransition();
  const [isDeleting, startDelete] = useTransition();
  const editDefaults = toEditDefaults(registration);
  const form = useForm<UpdateInterestRegistrationInput>({
    resolver: zodResolver(updateInterestRegistrationSchema),
    defaultValues: editDefaults,
  });

  function handleEditOpen(next: boolean) {
    setEditOpen(next);
    if (next) form.reset(toEditDefaults(registration));
  }

  function onUpdate(values: UpdateInterestRegistrationInput) {
    startUpdate(async () => {
      try {
        const result = await updateInterestRegistration(values);
        if (result.status === "error") {
          toast.error(result.message);
          return;
        }
        toast.success(result.message);
        setEditOpen(false);
        router.refresh();
      } catch {
        toast.error("The registration could not be updated. Please try again.");
      }
    });
  }

  function onDelete() {
    startDelete(async () => {
      try {
        const result = await deleteInterestRegistration({
          id: registration.id,
        });
        if (result.status === "error") {
          toast.error(result.message);
          return;
        }
        toast.success(result.message);
        setDeleteOpen(false);
        router.refresh();
      } catch {
        toast.error("The registration could not be deleted. Please try again.");
      }
    });
  }

  return (
    <div className="flex items-center justify-end gap-0.5">
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`View ${registration.full_name}`}
            />
          }
        >
          <EyeIcon />
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="truncate pr-8">
              {registration.full_name}
            </DialogTitle>
            <DialogDescription>Registration details</DialogDescription>
          </DialogHeader>
          <dl className="grid gap-3 text-sm">
            <div className="grid gap-1">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="break-all font-medium">{registration.email}</dd>
            </div>
            <div className="grid gap-1">
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="font-medium">{registration.phone}</dd>
            </div>
            <div className="grid gap-1">
              <dt className="text-muted-foreground">Company</dt>
              <dd className="font-medium">{registration.company_name}</dd>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="grid gap-1">
                <dt className="text-muted-foreground">Sector</dt>
                <dd className="font-medium">{registration.sector}</dd>
              </div>
              <div className="grid gap-1">
                <dt className="text-muted-foreground">Country</dt>
                <dd className="font-medium">{registration.country}</dd>
              </div>
            </div>
            <div className="grid gap-1">
              <dt className="text-muted-foreground">Pitch</dt>
              <dd className="whitespace-pre-wrap font-medium">
                {registration.pitch}
              </dd>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="grid gap-1">
                <dt className="text-muted-foreground">Consent</dt>
                <dd className="font-medium">
                  {registration.consent ? "Yes" : "No"}
                </dd>
              </div>
              <div className="grid gap-1">
                <dt className="text-muted-foreground">Submitted</dt>
                <dd className="font-medium">
                  {format(
                    new Date(registration.created_at),
                    "MMM d, yyyy HH:mm",
                  )}
                </dd>
              </div>
            </div>
          </dl>
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={handleEditOpen}>
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Edit ${registration.full_name}`}
            />
          }
        >
          <PencilIcon />
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit registration</DialogTitle>
            <DialogDescription>
              Update the submitted interest details.
            </DialogDescription>
          </DialogHeader>

          <form
            id={editFormId}
            onSubmit={form.handleSubmit(onUpdate)}
            noValidate
          >
            <input type="hidden" {...form.register("id")} />
            <FieldGroup>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={Boolean(form.formState.errors.fullName)}>
                  <Label htmlFor={`edit-name-${registration.id}`}>
                    Full name
                  </Label>
                  <Input
                    id={`edit-name-${registration.id}`}
                    disabled={isUpdating}
                    maxLength={INTEREST_REGISTRATION_FULL_NAME_MAX}
                    className="min-h-11"
                    aria-invalid={Boolean(form.formState.errors.fullName)}
                    {...form.register("fullName")}
                  />
                  <FormFieldError
                    message={form.formState.errors.fullName?.message}
                  />
                </Field>
                <Field data-invalid={Boolean(form.formState.errors.email)}>
                  <Label htmlFor={`edit-email-${registration.id}`}>Email</Label>
                  <Input
                    id={`edit-email-${registration.id}`}
                    type="email"
                    disabled={isUpdating}
                    maxLength={INTEREST_REGISTRATION_EMAIL_MAX}
                    className="min-h-11"
                    aria-invalid={Boolean(form.formState.errors.email)}
                    {...form.register("email")}
                  />
                  <FormFieldError
                    message={form.formState.errors.email?.message}
                  />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={Boolean(form.formState.errors.phone)}>
                  <Label htmlFor={`edit-phone-${registration.id}`}>Phone</Label>
                  <Input
                    id={`edit-phone-${registration.id}`}
                    type="tel"
                    disabled={isUpdating}
                    maxLength={INTEREST_REGISTRATION_PHONE_MAX}
                    className="min-h-11"
                    aria-invalid={Boolean(form.formState.errors.phone)}
                    {...form.register("phone")}
                  />
                  <FormFieldError
                    message={form.formState.errors.phone?.message}
                  />
                </Field>
                <Field
                  data-invalid={Boolean(form.formState.errors.companyName)}
                >
                  <Label htmlFor={`edit-company-${registration.id}`}>
                    Company
                  </Label>
                  <Input
                    id={`edit-company-${registration.id}`}
                    disabled={isUpdating}
                    maxLength={INTEREST_REGISTRATION_COMPANY_MAX}
                    className="min-h-11"
                    aria-invalid={Boolean(form.formState.errors.companyName)}
                    {...form.register("companyName")}
                  />
                  <FormFieldError
                    message={form.formState.errors.companyName?.message}
                  />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={Boolean(form.formState.errors.sector)}>
                  <Label htmlFor={`edit-sector-${registration.id}`}>
                    Sector
                  </Label>
                  <Input
                    id={`edit-sector-${registration.id}`}
                    disabled={isUpdating}
                    maxLength={INTEREST_REGISTRATION_SECTOR_MAX}
                    className="min-h-11"
                    aria-invalid={Boolean(form.formState.errors.sector)}
                    {...form.register("sector")}
                  />
                  <FormFieldError
                    message={form.formState.errors.sector?.message}
                  />
                </Field>
                <Field data-invalid={Boolean(form.formState.errors.country)}>
                  <Label htmlFor={`edit-country-${registration.id}`}>
                    Country
                  </Label>
                  <Input
                    id={`edit-country-${registration.id}`}
                    disabled={isUpdating}
                    maxLength={INTEREST_REGISTRATION_COUNTRY_MAX}
                    className="min-h-11"
                    aria-invalid={Boolean(form.formState.errors.country)}
                    {...form.register("country")}
                  />
                  <FormFieldError
                    message={form.formState.errors.country?.message}
                  />
                </Field>
              </div>
              <Field data-invalid={Boolean(form.formState.errors.pitch)}>
                <Label htmlFor={`edit-pitch-${registration.id}`}>Pitch</Label>
                <Textarea
                  id={`edit-pitch-${registration.id}`}
                  rows={5}
                  disabled={isUpdating}
                  maxLength={INTEREST_REGISTRATION_PITCH_MAX}
                  className="min-h-32"
                  aria-invalid={Boolean(form.formState.errors.pitch)}
                  {...form.register("pitch")}
                />
                <FormFieldError
                  message={form.formState.errors.pitch?.message}
                />
              </Field>
            </FieldGroup>
          </form>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button type="submit" form={editFormId} disabled={isUpdating}>
              {isUpdating ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <PencilIcon />
              )}
              {isUpdating ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              aria-label={`Delete ${registration.full_name}`}
            />
          }
        >
          <Trash2Icon />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle>Delete registration?</AlertDialogTitle>
            <AlertDialogDescription className="break-all">
              This permanently deletes the interest registration from{" "}
              {registration.full_name} ({registration.email}). This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <Trash2Icon />
              )}
              {isDeleting ? "Deleting…" : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
