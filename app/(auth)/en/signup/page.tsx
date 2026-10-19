import type { Metadata } from "next";

import { signupLabelsFor } from "@/components/auth/auth-labels";
import { SignupForm } from "@/components/auth/signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function EnSignupPage() {
  const labels = signupLabelsFor("en");

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{labels.title}</CardTitle>
          <CardDescription>{labels.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm locale="en" labels={labels} />
        </CardContent>
      </Card>
    </main>
  );
}
