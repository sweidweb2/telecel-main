"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2Icon, UploadIcon } from "lucide-react";
import { toast } from "sonner";

import {
  createBlog,
  deleteBlog,
  removeBlogImage,
  updateBlog,
  uploadAuthorAvatar,
  uploadBlogThumbnail,
} from "@/actions/blogs";
import { BlogRichTextEditor } from "@/components/blogs/blog-rich-text-editor";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { RECOMMENDED_BLOG_CATEGORIES } from "@/constants/blog-categories";
import { ROUTES } from "@/constants/routes";
import { slugifyTitle } from "@/lib/blog-utils";
import type { Blog } from "@/types/blog";
import {
  BLOG_AUTHOR_NAME_MAX,
  BLOG_BODY_MAX,
  BLOG_CATEGORIES_MAX,
  BLOG_CATEGORY_MAX,
  BLOG_SLUG_MAX,
  BLOG_SUMMARY_MAX,
  BLOG_TITLE_MAX,
  createBlogSchema,
  type CreateBlogInput,
} from "@/validations/blog";

type BlogEditorFormProps = {
  mode: "create" | "edit";
  blog?: Blog;
  heading: string;
  description: string;
};

function FieldLabel({
  htmlFor,
  children,
  hint,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
      <Label htmlFor={htmlFor}>{children}</Label>
      {hint ? (
        <span className="text-xs text-muted-foreground">{hint}</span>
      ) : null}
    </div>
  );
}

export function BlogEditorForm({
  mode,
  blog,
  heading,
  description,
}: BlogEditorFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [slugTouched, setSlugTouched] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [pendingCover, setPendingCover] = useState<File | null>(null);
  const [pendingAvatar, setPendingAvatar] = useState<File | null>(null);
  const [pendingCoverPreview, setPendingCoverPreview] = useState<string | null>(
    null,
  );
  const [createdBlogId, setCreatedBlogId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const isCreateSuccessOpen = Boolean(createdBlogId);

  const emptyCreateValues: CreateBlogInput = {
    title: "",
    slug: "",
    summary: "",
    bodyHtml: "",
    categories: [],
    authorName: "",
    status: "draft",
    isFeatured: false,
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<CreateBlogInput>({
    resolver: zodResolver(createBlogSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      title: blog?.title ?? "",
      slug: blog?.slug ?? "",
      summary: blog?.summary ?? "",
      bodyHtml: blog?.body_html ?? "",
      categories: blog?.categories ?? [],
      authorName: blog?.author_name ?? "",
      status: blog?.status ?? "draft",
      isFeatured: blog?.is_featured ?? false,
    },
  });

  const title = useWatch({ control, name: "title" });
  const categories = useWatch({ control, name: "categories" });
  const status = useWatch({ control, name: "status" });
  const isFeatured = useWatch({ control, name: "isFeatured" });

  function replacePendingCover(file: File | null) {
    setPendingCoverPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
    setPendingCover(file);
  }

  function toggleCategory(name: string) {
    const next = categories.includes(name)
      ? categories.filter((item) => item !== name)
      : [...categories, name];
    setValue("categories", next, { shouldValidate: false });
  }

  function onSubmit(values: CreateBlogInput) {
    startTransition(async () => {
      if (mode === "create") {
        const result = await createBlog(values);
        if (result.status === "error") {
          toast.error(result.message);
          return;
        }

        if (result.id && pendingCover) {
          const formData = new FormData();
          formData.set("file", pendingCover);
          const upload = await uploadBlogThumbnail(result.id, formData);
          if (upload.status === "error") {
            toast.error(upload.message);
          }
        }

        if (result.id && pendingAvatar) {
          const formData = new FormData();
          formData.set("file", pendingAvatar);
          const upload = await uploadAuthorAvatar(result.id, formData);
          if (upload.status === "error") {
            toast.error(upload.message);
          }
        }

        toast.success(result.message);
        if (result.id) {
          setCreatedBlogId(result.id);
          router.refresh();
        }
        return;
      }

      if (!blog) return;
      const result = await updateBlog({ ...values, id: blog.id });
      if (result.status === "error") {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      router.refresh();
    });
  }

  function onDelete() {
    if (!blog) return;
    startTransition(async () => {
      const result = await deleteBlog({ id: blog.id });
      if (result.status === "error") {
        toast.error(result.message);
        return;
      }
      setIsDeleteOpen(false);
      toast.success(result.message);
      router.push(ROUTES.blogs);
      router.refresh();
    });
  }

  function onPickCover(fileList: FileList | null) {
    const file = fileList?.[0] ?? null;
    if (mode === "create") {
      replacePendingCover(file);
      return;
    }
    if (!blog || !file) return;
    const formData = new FormData();
    formData.set("file", file);
    startTransition(async () => {
      const result = await uploadBlogThumbnail(blog.id, formData);
      if (result.status === "error") {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      router.refresh();
    });
  }

  function onPickAvatar(fileList: FileList | null) {
    const file = fileList?.[0] ?? null;
    if (mode === "create") {
      setPendingAvatar(file);
      return;
    }
    if (!blog || !file) return;
    const formData = new FormData();
    formData.set("file", file);
    startTransition(async () => {
      const result = await uploadAuthorAvatar(blog.id, formData);
      if (result.status === "error") {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      router.refresh();
    });
  }

  function onRemoveCover() {
    if (mode === "create") {
      replacePendingCover(null);
      if (coverInputRef.current) coverInputRef.current.value = "";
      return;
    }
    if (!blog) return;
    startTransition(async () => {
      const result = await removeBlogImage({ id: blog.id, kind: "thumbnail" });
      if (result.status === "error") {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      router.refresh();
    });
  }

  function onRemoveAvatar() {
    if (mode === "create") {
      setPendingAvatar(null);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
      return;
    }
    if (!blog) return;
    startTransition(async () => {
      const result = await removeBlogImage({ id: blog.id, kind: "author" });
      if (result.status === "error") {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      router.refresh();
    });
  }

  function goToCreatedBlog() {
    if (!createdBlogId) return;
    router.push(`${ROUTES.blogs}/${createdBlogId}`);
    router.refresh();
  }

  function continueCreating() {
    setCreatedBlogId(null);
    setSlugTouched(false);
    replacePendingCover(null);
    setPendingAvatar(null);
    if (coverInputRef.current) coverInputRef.current.value = "";
    if (avatarInputRef.current) avatarInputRef.current.value = "";
    reset(emptyCreateValues);
    clearErrors();
    router.push(`${ROUTES.blogs}/new`);
    router.refresh();
  }

  function goToBlogsList() {
    setCreatedBlogId(null);
    router.push(ROUTES.blogs);
    router.refresh();
  }

  const coverPreview =
    mode === "create" ? pendingCoverPreview : blog?.thumbnail_url ?? null;
  const hasCover = Boolean(coverPreview);
  const avatarFileLabel =
    mode === "create"
      ? pendingAvatar?.name ?? null
      : blog?.author_avatar_url
        ? "Avatar uploaded"
        : null;
  const hasAvatar = Boolean(
    mode === "create" ? pendingAvatar : blog?.author_avatar_url,
  );

  return (
    <>
    <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              {heading}
            </h2>
            <Badge variant={status === "published" ? "default" : "secondary"}>
              {status === "published" ? "Published" : "Draft"}
            </Badge>
            {isFeatured ? <Badge variant="outline">Featured hero</Badge> : null}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
          {mode === "edit" ? (
            <Button
              type="button"
              variant="destructive"
              className="min-h-11"
              disabled={isPending}
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash2Icon className="size-4" />
              Delete
            </Button>
          ) : null}
          <Button type="submit" className="min-h-11" disabled={isPending}>
            {isPending ? (
              <>
                <Spinner />
                Saving…
              </>
            ) : mode === "create" ? (
              "Create blog"
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] lg:items-start">
        {/* Left: content fields */}
        <div className="grid min-w-0 gap-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="grid gap-2">
              <FieldLabel htmlFor="blog-title" hint={`2–${BLOG_TITLE_MAX} chars`}>
                Title
              </FieldLabel>
              <Input
                id="blog-title"
                className="min-h-11"
                placeholder="e.g. Improve your design skills"
                disabled={isPending}
                aria-invalid={Boolean(errors.title)}
                {...register("title", {
                  onChange: (event) => {
                    if (mode === "create" && !slugTouched) {
                      setValue("slug", slugifyTitle(event.target.value), {
                        shouldValidate: false,
                      });
                    }
                  },
                })}
              />
              {errors.title ? (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <FieldLabel
                htmlFor="blog-slug"
                hint={`2–${BLOG_SLUG_MAX} · a-z 0-9 -`}
              >
                Slug
              </FieldLabel>
              <Input
                id="blog-slug"
                className="min-h-11"
                placeholder="e.g. improve-your-design-skills"
                disabled={isPending}
                aria-invalid={Boolean(errors.slug)}
                {...register("slug", {
                  onChange: () => {
                    setSlugTouched(true);
                  },
                })}
              />
              {errors.slug ? (
                <p className="text-sm text-destructive">{errors.slug.message}</p>
              ) : null}
            </div>
            <div className="grid gap-2 sm:col-span-2 xl:col-span-1">
              <FieldLabel
                htmlFor="blog-author"
                hint={`2–${BLOG_AUTHOR_NAME_MAX} chars`}
              >
                Author
              </FieldLabel>
              <Input
                id="blog-author"
                className="min-h-11"
                placeholder="e.g. Amélie Laurent"
                disabled={isPending}
                aria-invalid={Boolean(errors.authorName)}
                {...register("authorName")}
              />
              {errors.authorName ? (
                <p className="text-sm text-destructive">
                  {errors.authorName.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-2">
            <FieldLabel
              htmlFor="blog-summary"
              hint={`2–${BLOG_SUMMARY_MAX} chars`}
            >
              Summary
            </FieldLabel>
            <Textarea
              id="blog-summary"
              rows={3}
              className="min-h-24"
              placeholder="Short summary shown on cards and search results"
              disabled={isPending}
              aria-invalid={Boolean(errors.summary)}
              {...register("summary")}
            />
            {errors.summary ? (
              <p className="text-sm text-destructive">{errors.summary.message}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <FieldLabel hint={`max ${BLOG_BODY_MAX.toLocaleString()} chars`}>
              Body
            </FieldLabel>
            <Controller
              name="bodyHtml"
              control={control}
              render={({ field }) => (
                <BlogRichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPending}
                  placeholder="Write the article body…"
                />
              )}
            />
            {errors.bodyHtml ? (
              <p className="text-sm text-destructive">
                {errors.bodyHtml.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card size="sm" className="min-w-0">
              <CardHeader className="border-b">
                <CardTitle>Publishing</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Visibility and hero placement
                </p>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="flex items-center gap-3">
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="blog-published"
                        checked={field.value === "published"}
                        disabled={isPending}
                        onCheckedChange={(checked) => {
                          const next =
                            checked === true ? "published" : "draft";
                          field.onChange(next);
                          if (next === "draft") {
                            setValue("isFeatured", false, {
                              shouldDirty: true,
                            });
                          }
                        }}
                        className="size-5"
                      />
                    )}
                  />
                  <Label htmlFor="blog-published" className="font-normal">
                    Published (visible on Insights)
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Controller
                    name="isFeatured"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="blog-featured"
                        checked={field.value}
                        disabled={isPending || status !== "published"}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                        className="size-5"
                      />
                    )}
                  />
                  <Label
                    htmlFor="blog-featured"
                    className={
                      status !== "published"
                        ? "font-normal text-muted-foreground"
                        : "font-normal"
                    }
                  >
                    Featured hero (only one at a time)
                  </Label>
                </div>
                {errors.isFeatured ? (
                  <p className="text-sm text-destructive">
                    {errors.isFeatured.message}
                  </p>
                ) : null}
              </CardContent>
            </Card>

            <Card size="sm" className="min-w-0">
              <CardHeader className="border-b">
                <CardTitle>Author avatar</CardTitle>
                <p className="text-xs text-muted-foreground">
                  JPEG/PNG/WebP/GIF · max 2MB
                </p>
              </CardHeader>
              <CardContent>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(event) => onPickAvatar(event.target.files)}
                />
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="min-h-11 shrink-0"
                    disabled={isPending}
                    onClick={() => avatarInputRef.current?.click()}
                  >
                    <UploadIcon className="size-4" />
                    {hasAvatar ? "Replace" : "Choose file"}
                  </Button>
                  {hasAvatar ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="min-h-11 shrink-0"
                      disabled={isPending}
                      onClick={onRemoveAvatar}
                    >
                      Remove
                    </Button>
                  ) : null}
                  <span className="min-w-0 truncate text-sm text-muted-foreground">
                    {avatarFileLabel ?? "No file selected"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right: cover + categories */}
        <aside className="grid gap-4 lg:sticky lg:top-4">
          <Card size="sm">
            <CardHeader className="border-b">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <CardTitle>Cover image</CardTitle>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    JPEG/PNG/WebP/GIF · max 5MB
                  </p>
                </div>
                <div className="flex gap-2">
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(event) => onPickCover(event.target.files)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="min-h-11"
                    disabled={isPending}
                    onClick={() => coverInputRef.current?.click()}
                  >
                    <UploadIcon className="size-4" />
                    Upload
                  </Button>
                  {hasCover ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="min-h-11"
                      disabled={isPending}
                      onClick={onRemoveCover}
                    >
                      Remove
                    </Button>
                  ) : null}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-[1.5] w-full overflow-hidden rounded-lg bg-muted">
                {coverPreview ? (
                  mode === "create" ? (
                    // Local File preview (blob:) — native img avoids next/image remote rules
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={coverPreview}
                      alt={title || "Cover preview"}
                      className="absolute inset-0 size-full object-cover"
                    />
                  ) : (
                    <Image
                      src={coverPreview}
                      alt={title || "Cover preview"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 22rem"
                    />
                  )
                ) : (
                  <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No cover yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader className="border-b">
              <CardTitle>Categories</CardTitle>
              <p className="text-xs text-muted-foreground">
                up to {BLOG_CATEGORIES_MAX} · each max {BLOG_CATEGORY_MAX} chars
              </p>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="flex flex-wrap gap-2">
                {RECOMMENDED_BLOG_CATEGORIES.map((name) => {
                  const active = categories.includes(name);
                  return (
                    <Button
                      key={name}
                      type="button"
                      size="sm"
                      variant={active ? "default" : "outline"}
                      className="min-h-11"
                      disabled={isPending}
                      onClick={() => toggleCategory(name)}
                    >
                      {name}
                    </Button>
                  );
                })}
              </div>
              <Input
                className="min-h-11"
                placeholder="Add custom category and press Enter"
                disabled={isPending}
                onKeyDown={(event) => {
                  if (event.key !== "Enter") return;
                  event.preventDefault();
                  const value = event.currentTarget.value.trim();
                  if (!value || categories.includes(value)) return;
                  setValue("categories", [...categories, value], {
                    shouldValidate: false,
                  });
                  event.currentTarget.value = "";
                }}
              />
              {categories.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {categories.map((name) => (
                    <li key={name}>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="min-h-11"
                        disabled={isPending}
                        onClick={() => toggleCategory(name)}
                      >
                        {name} ×
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : null}
              {errors.categories ? (
                <p className="text-sm text-destructive">
                  {errors.categories.message ?? errors.categories.root?.message}
                </p>
              ) : null}
            </CardContent>
          </Card>
        </aside>
      </div>
    </form>

    <Dialog
      open={isCreateSuccessOpen}
      onOpenChange={(open) => {
        if (!open) goToBlogsList();
      }}
    >
      <DialogContent
        className="sm:max-w-md"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>Blog created</DialogTitle>
          <DialogDescription>
            Your post was saved. What would you like to do next?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col sm:justify-stretch">
          <Button
            type="button"
            className="min-h-11 w-full"
            onClick={goToCreatedBlog}
          >
            Edit this post
          </Button>
          <Button
            type="button"
            variant="outline"
            className="min-h-11 w-full"
            onClick={continueCreating}
          >
            Create another
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="min-h-11 w-full"
            onClick={goToBlogsList}
          >
            Back to blogs
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
      <AlertDialogContent>
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle>Delete this blog?</AlertDialogTitle>
          <AlertDialogDescription>
            {blog?.title
              ? `This permanently deletes “${blog.title}”. This cannot be undone.`
              : "This permanently deletes the blog post. This cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            className="min-h-11"
            disabled={isPending}
            onClick={onDelete}
          >
            {isPending ? (
              <>
                <Spinner />
                Deleting…
              </>
            ) : (
              <>
                <Trash2Icon className="size-4" />
                Delete
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
