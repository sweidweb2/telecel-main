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
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { createUser, deleteUser, updateUser } from "@/actions/users";
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
import { Badge } from "@/components/ui/badge";
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
import type { Profile } from "@/types/profile";
import {
  createUserSchema,
  updateUserSchema,
  USER_EMAIL_MAX,
  USER_FORM_ROLE,
  USER_FULL_NAME_MAX,
  USER_PASSWORD_MAX,
  type CreateUserInput,
  type UpdateUserInput,
} from "@/validations/users";

function FormFieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <FieldError>{message}</FieldError>;
}

function LockedRoleField({ id }: { id: string }) {
  return (
    <Field>
      <Label htmlFor={id}>Role</Label>
      <Input
        id={id}
        value="Admin"
        readOnly
        disabled
        aria-readonly="true"
        className="bg-muted/50"
      />
      <p className="text-xs text-muted-foreground">
        New and updated users are assigned the admin role.
      </p>
    </Field>
  );
}

export function CreateUserDialog() {
  const formId = useId();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: USER_FORM_ROLE,
    },
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      form.reset({
        fullName: "",
        email: "",
        password: "",
        role: USER_FORM_ROLE,
      });
    }
  }

  function onSubmit(values: CreateUserInput) {
    startTransition(async () => {
      try {
        const result = await createUser({ ...values, role: USER_FORM_ROLE });
        if (result.status === "error") {
          toast.error(result.message);
          return;
        }
        toast.success(result.message);
        setOpen(false);
        form.reset();
        router.refresh();
      } catch {
        toast.error("The user could not be created. Please try again.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button className="min-h-11 w-full sm:min-h-8 sm:w-auto" />
        }
      >
        <PlusIcon />
        Create user
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create user</DialogTitle>
          <DialogDescription>
            Create a confirmed login and linked profile.
          </DialogDescription>
        </DialogHeader>

        <form
          id={formId}
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <input type="hidden" {...form.register("role")} />
          <FieldGroup>
            <Field data-invalid={Boolean(form.formState.errors.fullName)}>
              <Label htmlFor="create-full-name">Full name</Label>
              <Input
                id="create-full-name"
                autoComplete="name"
                disabled={isPending}
                maxLength={USER_FULL_NAME_MAX}
                aria-invalid={Boolean(form.formState.errors.fullName)}
                {...form.register("fullName")}
              />
              <FormFieldError message={form.formState.errors.fullName?.message} />
            </Field>
            <Field data-invalid={Boolean(form.formState.errors.email)}>
              <Label htmlFor="create-email">Email</Label>
              <Input
                id="create-email"
                type="email"
                autoComplete="email"
                disabled={isPending}
                maxLength={USER_EMAIL_MAX}
                aria-invalid={Boolean(form.formState.errors.email)}
                {...form.register("email")}
              />
              <FormFieldError message={form.formState.errors.email?.message} />
            </Field>
            <Field data-invalid={Boolean(form.formState.errors.password)}>
              <Label htmlFor="create-password">Temporary password</Label>
              <Input
                id="create-password"
                type="password"
                autoComplete="new-password"
                disabled={isPending}
                maxLength={USER_PASSWORD_MAX}
                placeholder='Defaults to "password" if empty'
                aria-invalid={Boolean(form.formState.errors.password)}
                {...form.register("password")}
              />
              <FormFieldError
                message={form.formState.errors.password?.message}
              />
            </Field>
            <LockedRoleField id="create-role" />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" form={formId} disabled={isPending}>
            {isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <PlusIcon />
            )}
            {isPending ? "Creating…" : "Create user"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function UserRowActions({ user }: { user: Profile }) {
  const editFormId = useId();
  const router = useRouter();
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isUpdating, startUpdate] = useTransition();
  const [isDeleting, startDelete] = useTransition();
  const editDefaults: UpdateUserInput = {
    id: user.id,
    fullName: user.full_name ?? "",
    email: user.email,
    role: USER_FORM_ROLE,
  };
  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: editDefaults,
  });

  function handleEditOpen(next: boolean) {
    setEditOpen(next);
    if (next) form.reset(editDefaults);
  }

  function onUpdate(values: UpdateUserInput) {
    startUpdate(async () => {
      try {
        const result = await updateUser({ ...values, role: USER_FORM_ROLE });
        if (result.status === "error") {
          toast.error(result.message);
          return;
        }
        toast.success(result.message);
        setEditOpen(false);
        router.refresh();
      } catch {
        toast.error("The user could not be updated. Please try again.");
      }
    });
  }

  function onDelete() {
    startDelete(async () => {
      try {
        const result = await deleteUser({ id: user.id });
        if (result.status === "error") {
          toast.error(result.message);
          return;
        }
        toast.success(result.message);
        setDeleteOpen(false);
        router.refresh();
      } catch {
        toast.error("The user could not be deleted. Please try again.");
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
              aria-label={`View ${user.email}`}
            />
          }
        >
          <EyeIcon />
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="truncate pr-8">
              {user.full_name || "Unnamed user"}
            </DialogTitle>
            <DialogDescription>User profile details</DialogDescription>
          </DialogHeader>
          <dl className="grid gap-3 text-sm">
            <div className="grid gap-1">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="break-all font-medium">{user.email}</dd>
            </div>
            <div className="grid gap-1">
              <dt className="text-muted-foreground">Role</dt>
              <dd>
                <Badge variant="outline">{user.role}</Badge>
              </dd>
            </div>
            <div className="grid gap-1">
              <dt className="text-muted-foreground">User ID</dt>
              <dd className="break-all font-mono text-xs">{user.id}</dd>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <dt className="text-muted-foreground">Created</dt>
                <dd className="font-medium">
                  {format(new Date(user.created_at), "MMM d, yyyy")}
                </dd>
              </div>
              <div className="grid gap-1">
                <dt className="text-muted-foreground">Updated</dt>
                <dd className="font-medium">
                  {format(new Date(user.updated_at), "MMM d, yyyy")}
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
              aria-label={`Edit ${user.email}`}
            />
          }
        >
          <PencilIcon />
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
            <DialogDescription>
              Update email and profile details for this account.
            </DialogDescription>
          </DialogHeader>

          <form
            id={editFormId}
            onSubmit={form.handleSubmit(onUpdate)}
            noValidate
          >
            <input type="hidden" {...form.register("id")} />
            <input type="hidden" {...form.register("role")} />
            <FieldGroup>
              <Field data-invalid={Boolean(form.formState.errors.fullName)}>
                <Label htmlFor={`edit-name-${user.id}`}>Full name</Label>
                <Input
                  id={`edit-name-${user.id}`}
                  disabled={isUpdating}
                  maxLength={USER_FULL_NAME_MAX}
                  aria-invalid={Boolean(form.formState.errors.fullName)}
                  {...form.register("fullName")}
                />
                <FormFieldError
                  message={form.formState.errors.fullName?.message}
                />
              </Field>
              <Field data-invalid={Boolean(form.formState.errors.email)}>
                <Label htmlFor={`edit-email-${user.id}`}>Email</Label>
                <Input
                  id={`edit-email-${user.id}`}
                  type="email"
                  disabled={isUpdating}
                  maxLength={USER_EMAIL_MAX}
                  aria-invalid={Boolean(form.formState.errors.email)}
                  {...form.register("email")}
                />
                <FormFieldError
                  message={form.formState.errors.email?.message}
                />
              </Field>
              <LockedRoleField id={`edit-role-${user.id}`} />
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
              aria-label={`Delete ${user.email}`}
            />
          }
        >
          <Trash2Icon />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription className="break-all">
              This permanently deletes {user.email} from Auth and removes the
              linked profile. This cannot be undone.
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
              {isDeleting ? "Deleting…" : "Delete user"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
