/** Whether a nav href matches the current pathname (exact or nested). */
export function isNavActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
