"use client"

import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { 
  loginSchema, 
  magicLinkSchema, 
  type LoginInput, 
  type MagicLinkInput 
} from "@/lib/validations/auth";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoginForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    setError: setPasswordError,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerMagicLink,
    handleSubmit: handleMagicLinkSubmit,
    formState: { errors: magicLinkErrors, isSubmitting: isMagicLinkSubmitting },
    setError: setMagicLinkError,
  } = useForm<MagicLinkInput>({
    resolver: zodResolver(magicLinkSchema),
  });

  const onPasswordSubmit = async (data: LoginInput) => {
    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (signInError) {
      setPasswordError("root", { 
        message: signInError.message 
      });
      return;
    }

    router.push("/home");
    router.refresh();
  };

  const onMagicLinkSubmit = async (data: MagicLinkInput) => {
    const supabase = createClient();

    const { error: magicLinkError } = await supabase.auth.signInWithOtp({
      email: data.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (magicLinkError) {
      setMagicLinkError("root", {
        message: magicLinkError.message
      });
      return;
    }

    // Show success message
    setMagicLinkError("root", {
      message: "Check your email for the magic link"
    });
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Tabs defaultValue="password" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
        </TabsList>
        
        <div className="min-h-[280px] mt-6">
          <TabsContent value="password" className="mt-0">
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} noValidate>
              <div className="grid gap-6">
                {passwordErrors.root?.message && (
                  <Alert variant="destructive" className="mb-4">
                    {passwordErrors.root.message}
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
                      disabled={isPasswordSubmitting}
                      {...registerPassword("email")}
                      className={cn(
                        "pl-10",
                        passwordErrors.email ? "border-red-500" : ""
                      )}
                    />
                  </div>
                  {passwordErrors.email && (
                    <p className="text-sm text-red-500">{passwordErrors.email.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/reset-password"
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Icons.key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      disabled={isPasswordSubmitting}
                      {...registerPassword("password")}
                      className={cn(
                        "pl-10",
                        passwordErrors.password ? "border-red-500" : ""
                      )}
                    />
                  </div>
                  {passwordErrors.password && (
                    <p className="text-sm text-red-500">{passwordErrors.password.message}</p>
                  )}
                </div>
                <Button disabled={isPasswordSubmitting}>
                  {isPasswordSubmitting && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign In with Email
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="magic-link" className="mt-0">
            <form onSubmit={handleMagicLinkSubmit(onMagicLinkSubmit)} noValidate>
              <div className="grid gap-6">
                {magicLinkErrors.root?.message && (
                  <Alert 
                    variant={magicLinkErrors.root.message.includes("Check your email") ? "default" : "destructive"} 
                    className="mb-4"
                  >
                    {magicLinkErrors.root.message}
                  </Alert>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="magic-link-email">Email</Label>
                  <div className="relative">
                    <Icons.mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="magic-link-email"
                      type="email"
                      placeholder="name@company.com"
                      autoComplete="email"
                      disabled={isMagicLinkSubmitting}
                      {...registerMagicLink("email")}
                      className={cn(
                        "pl-10",
                        magicLinkErrors.email ? "border-red-500" : ""
                      )}
                    />
                  </div>
                  {magicLinkErrors.email && (
                    <p className="text-sm text-red-500">{magicLinkErrors.email.message}</p>
                  )}
                </div>
                <Button disabled={isMagicLinkSubmitting}>
                  {isMagicLinkSubmitting && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Send Magic Link
                </Button>
              </div>
            </form>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
