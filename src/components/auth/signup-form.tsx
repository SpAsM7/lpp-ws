"use client"

import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUp } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { signUpSchema, type SignUpInput } from "@/lib/validations/auth";
import { Suspense } from "react";

export function SignUpForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpInput) => {
    const { error } = await signUp(data);

    if (error) {
      setError("root", { 
        message: error.message,
        type: "manual" 
      });
      return;
    }

    // Show success message
    setError("root", {
      message: "Check your email to confirm your account",
      type: "success"
    });
  };

  return (
    <div className={cn("grid gap-8", className)} {...props}>
      <Suspense fallback={<SignUpFormSkeleton />}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-6">
            {errors.root?.message && (
              <Alert 
                variant={errors.root.type === "success" ? "success" : "destructive"} 
                className="mb-4 flex items-center"
              >
                {errors.root.type === "success" && (
                  <Icons.check className="h-4 w-4 mr-2 flex-shrink-0" />
                )}
                <span>{errors.root.message}</span>
                {errors.root.type !== "success" && errors.root?.action && (
                  <span className="text-sm opacity-80 block mt-1">{errors.root.action}</span>
                )}
              </Alert>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Icons.mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  autoComplete="email"
                  disabled={isSubmitting}
                  {...register("email")}
                  className={cn(
                    "pl-10",
                    errors.email ? "border-red-500" : ""
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Icons.key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  {...register("password")}
                  className={cn(
                    "pl-10",
                    errors.password ? "border-red-500" : ""
                  )}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            <Button disabled={isSubmitting}>
              {isSubmitting && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign up
            </Button>
          </div>
        </form>
      </Suspense>
      <div className="text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
}

function SignUpFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

// Types
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}
