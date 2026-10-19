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
  deleteContactMessage,
  updateContactMessage,
} from "@/actions/contact-messages";
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
import type { ContactMessage } from "@/types/contact-message";
import {
  CONTACT_MESSAGE_BODY_MAX,
  CONTACT_MESSAGE_EMAIL_MAX,
  CONTACT_MESSAGE_FULL_NAME_MAX,
  CONTACT_MESSAGE_PHONE_MAX,
  CONTACT_MESSAGE_SUBJECT_MAX,
  updateContactMessageSchema,
  type UpdateContactMessageInput,
} from "@/validations/contact-message";

function FormFieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <FieldError>{message}</FieldError>;
}

function toEditDefaults(message: ContactMessage): UpdateContactMessageInput {
  return {
    id: message.id,
    fullName: message.full_name,
    email: message.email,
    phone: message.phone,
    subject: message.subject,
    message: message.message,
  };
}

export function ContactMessageRowActions({
  message,
}: {
  message: ContactMessage;
}) {
  const editFormId = useId();
  const router = useRouter();
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isUpdating, startUpdate] = useTransition();
  const [isDeleting, startDelete] = useTransition();
  const editDefaults = toEditDefaults(message);
  const form = useForm<UpdateContactMessageInput>({
    resolver: zodResolver(updateContactMessageSchema),
    defaultValues: editDefaults,
  });

  function handleEditOpen(next: boolean) {
    setEditOpen(next);
    if (next) form.reset(toEditDefaults(message));
  }

  function onUpdate(values: UpdateContactMessageInput) {
    startUpdate(async () => {
      try {
        const result = await updateContactMessage(values);
        if (result.status === "error") {
          toast.error(result.message);
          return;
        }
        toast.success(result.message);
        setEditOpen(false);
        router.refresh();
      } catch {
        toast.error("The message could not be updated. Please try again.");
      }
    });
  }

  function onDelete() {
    startDelete(async () => {
      try {
        const result = await deleteContactMessage({ id: message.id });
        if (result.status === "error") {
          toast.error(result.message);
          return;
        }
        toast.success(result.message);
        setDeleteOpen(false);
        router.refresh();
      } catch {
        toast.error("The message could not be deleted. Please try again.");
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
              aria-label={`View ${message.subject}`}
            />
          }
        >
          <EyeIcon />
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="truncate pr-8">{message.subject}</DialogTitle>
            <DialogDescription>Contact message details</DialogDescription>
          </DialogHeader>
          <dl className="grid gap-3 text-sm">
            <div className="grid gap-1">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-medium">{message.full_name}</dd>
            </div>
            <div className="grid gap-1">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="break-all font-medium">{message.email}</dd>
            </div>
            <div className="grid gap-1">
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="font-medium">{message.phone}</dd>
            </div>
            <div className="grid gap-1">
              <dt className="text-muted-foreground">Message</dt>
              <dd className="whitespace-pre-wrap font-medium">
                {message.message}
              </dd>
            </div>
            <div className="grid gap-1">
              <dt className="text-muted-foreground">Submitted</dt>
              <dd className="font-medium">
                {format(new Date(message.created_at), "MMM d, yyyy HH:mm")}
              </dd>
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
              aria-label={`Edit ${message.subject}`}
            />
          }
        >
          <PencilIcon />
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit message</DialogTitle>
            <DialogDescription>
              Update the submitted contact details.
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
                  <Label htmlFor={`edit-name-${message.id}`}>Full name</Label>
                  <Input
                    id={`edit-name-${message.id}`}
                    disabled={isUpdating}
                    maxLength={CONTACT_MESSAGE_FULL_NAME_MAX}
                    className="min-h-11"
                    aria-invalid={Boolean(form.formState.errors.fullName)}
                    {...form.register("fullName")}
                  />
                  <FormFieldError
                    message={form.formState.errors.fullName?.message}
                  />
                </Field>
                <Field data-invalid={Boolean(form.formState.errors.phone)}>
                  <Label htmlFor={`edit-phone-${message.id}`}>Phone</Label>
                  <Input
                    id={`edit-phone-${message.id}`}
                    type="tel"
                    disabled={isUpdating}
                    maxLength={CONTACT_MESSAGE_PHONE_MAX}
                    className="min-h-11"
                    aria-invalid={Boolean(form.formState.errors.phone)}
                    {...form.register("phone")}
                  />
                  <FormFieldError
                    message={form.formState.errors.phone?.message}
                  />
                </Field>
              </div>
              <Field data-invalid={Boolean(form.formState.errors.email)}>
                <Label htmlFor={`edit-email-${message.id}`}>Email</Label>
                <Input
                  id={`edit-email-${message.id}`}
                  type="email"
                  disabled={isUpdating}
                  maxLength={CONTACT_MESSAGE_EMAIL_MAX}
                  className="min-h-11"
                  aria-invalid={Boolean(form.formState.errors.email)}
                  {...form.register("email")}
                />
                <FormFieldError
                  message={form.formState.errors.email?.message}
                />
              </Field>
              <Field data-invalid={Boolean(form.formState.errors.subject)}>
                <Label htmlFor={`edit-subject-${message.id}`}>Subject</Label>
                <Input
                  id={`edit-subject-${message.id}`}
                  disabled={isUpdating}
                  maxLength={CONTACT_MESSAGE_SUBJECT_MAX}
                  className="min-h-11"
                  aria-invalid={Boolean(form.formState.errors.subject)}
                  {...form.register("subject")}
                />
                <FormFieldError
                  message={form.formState.errors.subject?.message}
                />
              </Field>
              <Field data-invalid={Boolean(form.formState.errors.message)}>
                <Label htmlFor={`edit-message-${message.id}`}>Message</Label>
                <Textarea
                  id={`edit-message-${message.id}`}
                  rows={5}
                  disabled={isUpdating}
                  maxLength={CONTACT_MESSAGE_BODY_MAX}
                  className="min-h-32"
                  aria-invalid={Boolean(form.formState.errors.message)}
                  {...form.register("message")}
                />
                <FormFieldError
                  message={form.formState.errors.message?.message}
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
              aria-label={`Delete ${message.subject}`}
            />
          }
        >
          <Trash2Icon />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle>Delete message?</AlertDialogTitle>
            <AlertDialogDescription className="break-all">
              This permanently deletes the message from {message.full_name} (
              {message.email}). This cannot be undone.
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
