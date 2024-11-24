"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export function AuthHeader() {
  const pathname = usePathname()
  const isLoginPage = pathname === "/auth/login"

  return (
    <div className="absolute right-4 top-4 md:right-8 md:top-8">
      <Button variant="ghost" asChild>
        <Link href={isLoginPage ? "/auth/signup" : "/auth/login"}>
          {isLoginPage ? "Sign up" : "Login"}
        </Link>
      </Button>
    </div>
  )
}
