import { SignUpForm } from "@/components/auth/signup-form";

export default function SignUpPage() {
  return (
    <>
      <div className="flex flex-col space-y-4 text-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to create your account
        </p>
      </div>
      <SignUpForm />
    </>
  );
}
