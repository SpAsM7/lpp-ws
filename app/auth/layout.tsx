import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AuthHeader } from "./_components/auth-header"
import { AuthAnimation } from "./_components/auth-animation"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get the current path
  const pathname = headersList.get("x-invoke-path") || ""
  const isCallback = pathname.endsWith("/callback")

  // For callback route, render children directly without layout
  if (isCallback) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {children}
      </div>
    )
  }

  // Only redirect if not in callback route
  if (session && !isCallback) {
    redirect("/home")
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="absolute inset-0 flex items-center justify-center">
          <AuthAnimation />
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Emberline Portal
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              Manage your investments, access documents,
              and stay up to date with your portfolio.
            </p>
          </blockquote>
        </div>
      </div>
      <div className="relative flex h-full flex-col items-center justify-center">
        <div className="w-full max-w-[350px] px-8">
          {children}
        </div>
      </div>
      <AuthHeader />
    </div>
  )
}
