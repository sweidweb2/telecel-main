import type { Instrumentation } from "next";

/**
 * Records uncaught server errors (render, route handlers, actions, proxy)
 * into `app_errors`. Node runtime only (the admin client is not edge-safe);
 * persistence uses the admin client directly (no Next request, no
 * onRequestError re-entry) and swallows its own failures, so it cannot recurse.
 */
export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context,
) => {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  try {
    const { recordAppErrorNow } = await import("@/actions/observability");
    const message = error instanceof Error ? error.message : String(error);
    const digest =
      typeof error === "object" && error !== null && "digest" in error
        ? String((error as { digest: unknown }).digest)
        : null;

    await recordAppErrorNow({
      severity: "error",
      source: `instrumentation.${context.routeType}`,
      code: digest ?? (error instanceof Error ? error.name : null),
      message: message || "Unhandled server error",
      requestId: digest,
      context: {
        // Path only — query strings may carry tokens.
        path: request.path.split("?")[0],
        method: request.method,
        routePath: context.routePath,
        routeType: context.routeType,
        renderSource: context.renderSource ?? null,
      },
    });
  } catch {
    // Never let error reporting throw.
  }
};
