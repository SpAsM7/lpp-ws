import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <>
      <div className="flex flex-col space-y-4 text-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Log In
        </h1>
        <p className="text-sm text-muted-foreground">
          Choose your preferred way to sign in
        </p>
      </div>
      <LoginForm />
    </>
  );
}
