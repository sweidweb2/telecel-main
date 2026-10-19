/**
 * One-off seed: download Untitled UI dummy images and insert into blogs + storage.
 *
 * Usage (from repo root):
 *   node --env-file=.env --env-file=.env.local scripts/seed-blogs.mjs
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 */
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

const COVER_BUCKET = "blogs";
const AUTHOR_BUCKET = "auther";

function dummyBody(title) {
  return [
    `${title} is a topic that matters to founders building technology ventures across Africa. This article outlines practical ideas you can apply while scaling product, team, and market access.`,
    "ASIP shares these insights to help participating ventures and the wider ecosystem learn from real programme experience. The examples here are illustrative and will evolve as cohorts progress.",
    "Founders often face similar questions around prioritisation, customer discovery, and partnership strategy. We focus on patterns that appear repeatedly across markets and sectors.",
    "Use this as a starting point for conversation with mentors, peers, and partners. Programme-specific guidance is always shared directly with selected teams during each cycle.",
  ];
}

function bodyToHtml(paragraphs) {
  return paragraphs.map((p) => `<p>${p}</p>`).join("");
}

function parsePublishedAt(label) {
  const date = new Date(label);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid publishedAt: ${label}`);
  }
  return date.toISOString();
}

/** Featured hero + list cards from the former constants/blog-articles.ts */
const SEED_POSTS = [
  {
    slug: "improve-design-skills",
    title: 'Improve your design skills: Develop an "eye" for design',
    summary:
      'Tools and trends change, but good design is timeless. Learn how to quickly develop an "eye" for design.',
    categories: ["Design", "Research", "Presentation"],
    thumbnailUrl:
      "https://www.untitledui.com/marketing/blog-featured-post-01.webp",
    publishedAt: "10 April 2025",
    authorName: "Amélie Laurent",
    authorAvatarUrl:
      "https://www.untitledui.com/images/avatars/amelie-laurent?fm=webp&q=80",
    isFeatured: true,
    bodyTitle: 'Improve your design skills: Develop an "eye" for design',
  },
  {
    slug: "ux-review-presentations",
    title: "UX review presentations",
    summary:
      "How do you create compelling presentations that wow your colleagues and impress your managers?",
    categories: ["Design", "Research", "Presentation"],
    thumbnailUrl: "https://www.untitledui.com/marketing/spirals.webp",
    publishedAt: "20 Jan 2025",
    authorName: "Olivia Rhye",
    authorAvatarUrl:
      "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80",
    isFeatured: false,
    bodyTitle: "UX review presentations",
  },
  {
    slug: "migrating-to-linear-101",
    title: "Migrating to Linear 101",
    summary:
      "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get started.",
    categories: ["Product", "Tools", "SaaS"],
    thumbnailUrl: "https://www.untitledui.com/marketing/conversation.webp",
    publishedAt: "19 Jan 2025",
    authorName: "Phoenix Baker",
    authorAvatarUrl:
      "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80",
    isFeatured: false,
    bodyTitle: "Migrating to Linear 101",
  },
  {
    slug: "building-your-api-stack",
    title: "Building your API stack",
    summary:
      "The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.",
    categories: ["Software Engineering", "Software Development", "Tools"],
    thumbnailUrl:
      "https://www.untitledui.com/blog/two-mobile-shapes-pattern.webp",
    publishedAt: "18 Jan 2025",
    authorName: "Lana Steiner",
    authorAvatarUrl:
      "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80",
    isFeatured: false,
    bodyTitle: "Building your API stack",
  },
  {
    slug: "bill-walsh-leadership-lessons",
    title: "Bill Walsh leadership lessons",
    summary:
      "Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?",
    categories: ["Product", "Leadership", "Management"],
    thumbnailUrl: "https://www.untitledui.com/blog/two-people.webp",
    publishedAt: "17 Jan 2025",
    authorName: "Alec Whitten",
    authorAvatarUrl:
      "https://www.untitledui.com/images/avatars/alec-whitten?fm=webp&q=80",
    isFeatured: false,
    bodyTitle: "Bill Walsh leadership lessons",
  },
  {
    slug: "pm-mental-models",
    title: "PM mental models",
    summary:
      "Mental models are simple expressions of complex processes or relationships.",
    categories: ["Product", "Research", "Frameworks"],
    thumbnailUrl: "https://www.untitledui.com/marketing/smiling-girl-6.webp",
    publishedAt: "16 Jan 2025",
    authorName: "Demi Wilkinson",
    authorAvatarUrl:
      "https://www.untitledui.com/images/avatars/demi-wilkinson?fm=webp&q=80",
    isFeatured: false,
    bodyTitle: "PM mental models",
  },
  {
    slug: "what-is-wireframing",
    title: "What is wireframing?",
    summary:
      "Introduction to Wireframing and its Principles. Learn from the best in the industry.",
    categories: ["Design", "Research"],
    thumbnailUrl: "https://www.untitledui.com/marketing/wireframing-layout.webp",
    publishedAt: "15 Jan 2025",
    authorName: "Candice Wu",
    authorAvatarUrl:
      "https://www.untitledui.com/images/avatars/candice-wu?fm=webp&q=80",
    isFeatured: false,
    bodyTitle: "What is wireframing?",
  },
  {
    slug: "collaboration-better-designers",
    title: "How collaboration makes us better designers",
    summary:
      "Collaboration can make our teams stronger, and our individual designs better.",
    categories: ["Design", "Research"],
    thumbnailUrl: "https://www.untitledui.com/marketing/two-people.webp",
    publishedAt: "14 Jan 2025",
    authorName: "Natali Craig",
    authorAvatarUrl:
      "https://www.untitledui.com/images/avatars/natali-craig?fm=webp&q=80",
    isFeatured: false,
    bodyTitle: "How collaboration makes us better designers",
  },
  {
    slug: "top-javascript-frameworks",
    title: "Our top 10 Javascript frameworks to use",
    summary:
      "JavaScript frameworks make development easy with extensive features and functionalities.",
    categories: ["Product", "Software Development", "Tools", "SaaS"],
    thumbnailUrl: "https://www.untitledui.com/marketing/workspace-5.webp",
    publishedAt: "13 Jan 2025",
    authorName: "Drew Cano",
    authorAvatarUrl:
      "https://www.untitledui.com/images/avatars/drew-cano?fm=webp&q=80",
    isFeatured: false,
    bodyTitle: "Our top 10 Javascript frameworks to use",
  },
  {
    slug: "podcast-cx-community",
    title: "Podcast: Creating a better CX Community",
    summary:
      "Starting a community doesn't need to be complicated, but how do you get started?",
    categories: ["Customer Success", "Podcasts"],
    thumbnailUrl: "https://www.untitledui.com/marketing/sythesize.webp",
    publishedAt: "12 Jan 2025",
    authorName: "Orlando Diggs",
    authorAvatarUrl:
      "https://www.untitledui.com/images/avatars/orlando-diggs?fm=webp&q=80",
    isFeatured: false,
    bodyTitle: "Podcast: Creating a better CX Community",
  },
];

function mimeFromUrl(url, contentType) {
  if (contentType?.includes("png")) return { mime: "image/png", ext: "png" };
  if (contentType?.includes("gif")) return { mime: "image/gif", ext: "gif" };
  if (contentType?.includes("jpeg") || contentType?.includes("jpg")) {
    return { mime: "image/jpeg", ext: "jpg" };
  }
  if (url.includes(".png")) return { mime: "image/png", ext: "png" };
  return { mime: "image/webp", ext: "webp" };
}

async function downloadImage(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Download failed (${response.status}): ${url}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  const { mime, ext } = mimeFromUrl(url, response.headers.get("content-type"));
  return { buffer, mime, ext };
}

async function uploadImage(supabase, bucket, blogId, url) {
  const { buffer, mime, ext } = await downloadImage(url);
  const path = `${blogId}/${randomUUID().slice(0, 8)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
    contentType: mime,
    upsert: true,
  });
  if (error) throw error;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (use --env-file=.env --env-file=.env.local).",
    );
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Ensure only one featured row after seed.
  await supabase.from("blogs").update({ is_featured: false }).eq("is_featured", true);

  for (const post of SEED_POSTS) {
    const blogId = randomUUID();
    process.stdout.write(`Seeding ${post.slug}… `);

    const { data: existing } = await supabase
      .from("blogs")
      .select("id")
      .eq("slug", post.slug)
      .maybeSingle();

    if (existing) {
      console.log("skip (slug exists)");
      continue;
    }

    const thumbnailUrl = await uploadImage(
      supabase,
      COVER_BUCKET,
      blogId,
      post.thumbnailUrl,
    );
    const authorAvatarUrl = await uploadImage(
      supabase,
      AUTHOR_BUCKET,
      blogId,
      post.authorAvatarUrl,
    );

    const bodyHtml = bodyToHtml(dummyBody(post.bodyTitle));
    const { error } = await supabase.from("blogs").insert({
      id: blogId,
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      body_html: bodyHtml,
      categories: post.categories,
      thumbnail_url: thumbnailUrl,
      author_name: post.authorName,
      author_avatar_url: authorAvatarUrl,
      status: "published",
      is_featured: post.isFeatured,
      reading_time_minutes: 8,
      published_at: parsePublishedAt(post.publishedAt),
    });

    if (error) {
      console.log("FAILED");
      throw error;
    }
    console.log("ok");
  }

  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
