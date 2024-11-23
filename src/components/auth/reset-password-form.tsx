"use client"

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { magicLinkSchema, type MagicLinkInput } from "@/lib/validations/auth";

export function ResetPasswordForm({ className, ...props }: UserAuthFormProps) {
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<MagicLinkInput>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: MagicLinkInput) => {
    const supabase = createClient();

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery&next=/update-password`,
    });

    if (resetError) {
      setError("root", { 
        message: resetError.message 
      });
      return;
    }

    setSuccess(true);
  };

  const handleTryAgain = () => {
    setSuccess(false);
    reset();
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {success ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium">Check your email</h3>
          <p className="text-center text-sm text-muted-foreground">
            We have sent you a password reset link. Please check your email and follow
            the instructions to reset your password.
          </p>
          <Button
            variant="outline"
            onClick={handleTryAgain}
            className="mt-4"
          >
            Try again
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col space-y-4 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Reset your password
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid gap-6">
              {errors.root && (
                <Alert variant="destructive">
                  {errors.root.message}
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
              <Button disabled={isSubmitting}>
                {isSubmitting && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Send reset link
              </Button>
            </div>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            asChild
            className="w-full"
          >
            <Link href="/login">
              Back to login
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}

// Static content and interfaces at end of file
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}
