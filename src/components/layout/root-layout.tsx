"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { 
  Home, 
  Building2, 
  Briefcase, 
  FileText,
  Menu,
  ChevronDown
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  children?: { title: string; href: string }[]
}

const navigation: NavItem[] = [
  { title: "Home", href: "/home", icon: <Home className="h-5 w-5" /> },
  { 
    title: "Companies", 
    href: "/companies", 
    icon: <Building2 className="h-5 w-5" />,
    children: [
      { title: "Company 1", href: "/companies/company-1" },
      // Add more companies as needed
    ]
  },
  { 
    title: "Accounts", 
    href: "/accounts", 
    icon: <Briefcase className="h-5 w-5" />,
    children: [
      { title: "Account 1", href: "/accounts/account-1" },
      { title: "Account 2", href: "/accounts/account-2" },
      // Add more accounts as needed
    ]
  },
  { title: "Documents", href: "/documents", icon: <FileText className="h-5 w-5" /> },
]

export function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <button
              className="mr-2 px-2 hover:bg-accent hover:text-accent-foreground rounded-md"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </button>
            <Link href="/home" className="flex items-center space-x-2">
              <span className="font-bold">Emberline</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Sidebar and Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-64 border-r bg-background transition-transform duration-300",
            isSidebarOpen ? "translate-x-0" : "-translate-x-64"
          )}
        >
          <nav className="space-y-1 p-4">
            <div className="text-sm font-medium text-muted-foreground mb-2">Menu</div>
            {navigation.map((item) => (
              <NavItem key={item.href} item={item} pathname={pathname} />
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={cn(
            "flex-1 transition-all duration-300",
            isSidebarOpen ? "ml-64" : "ml-0"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

function NavItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

  if (item.children) {
    return (
      <div>
        <button
          className={cn(
            "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            isActive && "bg-accent text-accent-foreground"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center">
            {item.icon}
            <span className="ml-3">{item.title}</span>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>
        {isOpen && (
          <div className="ml-4 mt-1 space-y-1">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === child.href && "bg-accent text-accent-foreground"
                )}
              >
                {child.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground"
      )}
    >
      {item.icon}
      <span className="ml-3">{item.title}</span>
    </Link>
  )
} 