"use client"

import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldError } from "react-hook-form";
import { signUp } from "@/lib/supabase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/features/ui/utils/styles";
import { Icons } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { signUpSchema, type SignUpInput } from "@/lib/supabase/auth/validations";
import { Suspense } from "react";

interface CustomFieldError extends FieldError {
  type: "success" | "manual";
  action?: string;
}

interface SignUpFormData extends SignUpInput {
  root?: never;
}

export function SignUpForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpInput) => {
    clearErrors("root");
    const { error } = await signUp(data);

    if (error) {
      setError("root" as any, { 
        type: "manual",
        message: error.message
      } as CustomFieldError);
      return;
    }

    // Show success message
    setError("root" as any, {
      type: "success",
      message: "Check your email to confirm your account"
    } as CustomFieldError);
  };

  const rootError = errors.root as CustomFieldError | undefined;

  return (
    <div className={cn("grid gap-8", className)} {...props}>
      <Suspense fallback={<SignUpFormSkeleton />}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-6">
            {rootError?.message && (
              <Alert 
                variant={rootError.type === "success" ? "success" : "destructive"} 
                className="mb-4"
              >
                {rootError.type === "success" && (
                  <Icons.check className="h-4 w-4" />
                )}
                <AlertDescription className="flex flex-col">
                  <span>{rootError.message}</span>
                  {rootError.type !== "success" && rootError.action && (
                    <span className="text-sm opacity-80 mt-1">{rootError.action}</span>
                  )}
                </AlertDescription>
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
              <p className="text-sm text-muted-foreground">
                Password must be at least 8 characters and contain uppercase, lowercase, and numbers
              </p>
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
