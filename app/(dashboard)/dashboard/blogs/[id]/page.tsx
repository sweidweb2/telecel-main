import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogEditorForm } from "@/components/blogs/blog-editor-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ROUTES } from "@/constants/routes";
import { requireSection } from "@/data/auth";
import { getBlogByIdForStaff } from "@/data/blogs";

export const metadata: Metadata = { title: "Edit news article" };

export default async function EditBlogPage({
  params,
}: PageProps<"/dashboard/blogs/[id]">) {
  const { session } = await requireSection(ROUTES.blogs);
  const { id } = await params;
  const blog = await getBlogByIdForStaff(session, id);
  if (!blog) notFound();

  const pageLabel = blog.title.trim() || "Edit article";

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-6 p-4 sm:p-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={ROUTES.blogs} />}>
              News
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-[16rem] truncate sm:max-w-md">
              {pageLabel}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <BlogEditorForm
        mode="edit"
        blog={blog}
        heading="Edit article"
        description="Update content, publish status, featured hero, and images."
      />
    </main>
  );
}
