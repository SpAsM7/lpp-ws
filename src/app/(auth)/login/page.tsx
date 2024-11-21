import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email to sign in to your account
        </p>
      </div>
      <LoginForm />
      <p className="px-8 text-center text-sm text-muted-foreground">
        Don't have an account?<br />
        <Link
          href="/contact"
          className="underline underline-offset-4 hover:text-primary"
        >
          Contact us
        </Link>{" "}
        to get started.
      </p>
    </>
  );
}
