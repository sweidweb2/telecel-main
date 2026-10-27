import { RouteSkeleton } from "@/components/skeleton/route-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

function AuthFormFallback() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm space-y-4 rounded-xl p-6 ring-1 ring-foreground/10">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </main>
  );
}

export default function ForgotPasswordLoading() {
  return (
    <RouteSkeleton name="auth-forgot-password" fallback={<AuthFormFallback />} select="container" />
  );
}
