import { Suspense } from "react";
import type { Metadata } from "next";

import { loginLabelsFor } from "@/components/auth/auth-labels";
import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function LoginFormFallback() {
  return (
    <div className="grid gap-4">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-9 w-full" />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Login",
};

export default function EnLoginPage() {
  const labels = loginLabelsFor("en");

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{labels.title}</CardTitle>
          <CardDescription>{labels.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoginFormFallback />}>
            <LoginForm locale="en" labels={labels} />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
