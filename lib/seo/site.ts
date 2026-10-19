const LOCAL_SITE_URL = "http://localhost:3000";

export function siteUrl(): URL {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  try {
    return new URL(configured || LOCAL_SITE_URL);
  } catch {
    return new URL(LOCAL_SITE_URL);
  }
}

export function absoluteUrl(path: string = "/"): string {
  return new URL(path, siteUrl()).toString();
}
