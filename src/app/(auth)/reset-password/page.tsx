import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset your password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>
      <ResetPasswordForm />
    </>
  );
}
