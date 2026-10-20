import type { Metadata } from "next";
import Link from "next/link";

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

export const metadata: Metadata = {
  title: "New news article",
};

export default async function NewBlogPage() {
  await requireSection(ROUTES.blogs);

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
            <BreadcrumbPage>New article</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <BlogEditorForm
        mode="create"
        heading="New article"
        description="Draft a news article for Insights. You can attach a cover and author avatar before creating."
      />
    </main>
  );
}
