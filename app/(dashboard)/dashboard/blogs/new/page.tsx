import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

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
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "New blog | ASIP Admin",
};

export default async function NewBlogPage() {
  const supabase = await createClient();
  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error) throw error;
  if (!isAdmin) redirect(ROUTES.dashboard);

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-6 p-4 sm:p-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={ROUTES.blogs} />}>
              Blogs
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New blog</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <BlogEditorForm
        mode="create"
        heading="New blog"
        description="Draft an Insights article. You can attach a cover and author avatar before creating."
      />
    </main>
  );
}
