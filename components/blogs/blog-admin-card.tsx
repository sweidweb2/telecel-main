"use client";

import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";
import type { BlogListItem } from "@/types/blog";

type BlogAdminCardProps = {
  blog: BlogListItem;
};

export function BlogAdminCard({ blog }: BlogAdminCardProps) {
  const href = `${ROUTES.blogs}/${blog.id}`;
  const category = blog.categories[0] ?? "Uncategorized";
  const dateLabel = blog.published_at
    ? format(new Date(blog.published_at), "d MMM yyyy")
    : format(new Date(blog.created_at), "d MMM yyyy");

  return (
    <Link
      href={href}
      className="group flex flex-col gap-4 rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="relative aspect-[1.5] w-full overflow-hidden rounded-2xl bg-muted">
        {blog.thumbnail_url ? (
          <Image
            src={blog.thumbnail_url}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : null}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge variant={blog.status === "published" ? "default" : "secondary"}>
            {blog.status}
          </Badge>
          {blog.is_featured ? <Badge variant="outline">Hero</Badge> : null}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-primary">{category}</p>
        <div className="flex gap-3">
          <h3 className="flex-1 font-heading text-lg font-semibold tracking-tight text-balance group-hover:underline group-hover:underline-offset-4">
            {blog.title}
          </h3>
          <ArrowUpRight className="mt-0.5 size-5 shrink-0" />
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {blog.summary}
        </p>
        <p className="text-sm text-muted-foreground">
          {blog.author_name} · {dateLabel} · {blog.reading_time_minutes} min
          read
        </p>
      </div>
    </Link>
  );
}
