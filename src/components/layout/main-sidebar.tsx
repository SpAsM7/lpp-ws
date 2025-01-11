"use client"

import * as React from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { usePathname, useRouter } from "next/navigation"
import {
  ChevronRight,
  ChevronsUpDown,
  Wallet,
  FileText,
  LogOut,
  User,
  Bell,
  Home,
  Building,
  PieChart,
  GalleryVerticalEnd,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/features/ui/utils/styles"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { createSignOutAction } from "@/lib/actions/auth/create-signout"
import { useToast } from "@/components/ui/use-toast"
import { useUserProfile } from "@/lib/domains/user/hooks/use-user-profile"
import { Skeleton } from "@/components/ui/skeleton"
import { UserAvatar } from "@/components/user/user-avatar"

const data = {
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Companies",
      icon: Building,
      items: [
        { title: "Company 1", url: "/companies/company-1" },
        { title: "Company 2", url: "/companies/company-2" },
      ],
    },
    {
      title: "Investments",
      url: "/investments",
      icon: PieChart,
    },
    {
      title: "Accounts",
      icon: Wallet,
      items: [
        { title: "Account 1", url: "/accounts/account-1" },
        { title: "Account 2", url: "/accounts/account-2" },
      ],
    },
    {
      title: "Documents",
      url: "/documents",
      icon: FileText,
    },
  ],
}

interface SidebarProps {
  children: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const [mounted, setMounted] = React.useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const { data: profile, isLoading, error } = useUserProfile()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Handle error state
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      })
    }
  }, [error, toast])

  const handleLogout = async () => {
    try {
      const result = await createSignOutAction()
      
      if (!result.success) {
        toast({
          title: "Error",
          description: result.error || "Failed to sign out",
          variant: "destructive",
        })
        return
      }

      // Redirect to login page on successful logout
      router.push('/auth/login')
    } catch (error) {
      console.error('Error during logout:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  // Return a placeholder with similar dimensions during SSR
  if (!mounted) {
    return (
      <div className="w-full h-screen bg-background">
        <div className="flex h-full flex-col overflow-hidden">
          {/* Placeholder content */}
        </div>
      </div>
    )
  }

  const isActive = (url: string, items?: { url: string }[]) => {
    if (items) {
      // For parent items (Companies/Accounts)
      const parentPath = `/${url.toLowerCase()}`
      return pathname === parentPath
    }

    // For regular menu items and sub-items
    return pathname === url
  }

  const isSidebarMinimized = () => {
    return document.querySelector('[data-collapsible="icon"]') !== null
  }

  return (
    <div suppressHydrationWarning>
      <SidebarProvider>
        <UISidebar collapsible="icon" className="overflow-hidden">
          <div className="flex h-full flex-col overflow-hidden">
            <SidebarHeader>
              <SidebarMenu>
                <SidebarMenuItem key="logo">
                  <SidebarMenuButton
                    size="lg"
                    className={cn(
                      "flex items-center",
                      "group-data-[collapsible=icon]:justify-center"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center",
                        "gap-2",
                        "group-data-[collapsible=icon]:gap-0"
                      )}
                    >
                      <GalleryVerticalEnd className="size-5" />
                      <span className="font-semibold overflow-hidden transition-[width] duration-200 ease-linear group-data-[collapsible=icon]:w-0">
                        LP Portal
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Menu</SidebarGroupLabel>
                <SidebarMenu>
                  {data.navMain.map((item, index) => (
                    <Collapsible
                      key={`nav-${index}`}
                      asChild
                      className="group/collapsible"
                    >
                      <SidebarMenuItem key={`menu-${index}`}>
                        {item.url ? (
                          <Link href={item.url}>
                            <SidebarMenuButton
                              tooltip={item.title}
                              className={isActive(item.url) ? "bg-accent text-accent-foreground" : ""}
                            >
                              {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                              <span className="overflow-hidden transition-all group-[[data-collapsible=icon]]/sidebar:w-0">
                                {item.title}
                              </span>
                            </SidebarMenuButton>
                          </Link>
                        ) : (
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              tooltip={item.title}
                              className={isActive(item.title, item.items) ? "bg-accent text-accent-foreground" : ""}
                              onClick={(e) => {
                                if (isSidebarMinimized() && item.items) {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  router.push(`/${item.title.toLowerCase()}`)
                                }
                              }}
                            >
                              {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                              <span className="overflow-hidden transition-all group-[[data-collapsible=icon]]/sidebar:w-0">
                                {item.title}
                              </span>
                              {item.items && (
                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 shrink-0" />
                              )}
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                        )}
                        {item.items && (
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items.map((subItem, subIndex) => (
                                <SidebarMenuSubItem key={`sub-${index}-${subIndex}`}>
                                  <SidebarMenuSubButton
                                    asChild
                                    className={pathname === subItem.url ? "bg-accent" : ""}
                                  >
                                    <Link href={subItem.url}>
                                      <span
                                        className={cn(
                                          "overflow-hidden transition-all group-[[data-collapsible=icon]]/sidebar:w-0",
                                          pathname === subItem.url && "text-accent-foreground font-medium"
                                        )}
                                      >
                                        {subItem.title}
                                      </span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        )}
                      </SidebarMenuItem>
                    </Collapsible>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem key="user-dropdown">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-accent data-[state=open]:text-primary"
                      >
                        <UserAvatar
                          profile={profile}
                          isLoading={isLoading}
                          className="shrink-0"
                        />
                        <div className="grid flex-1 text-left text-sm leading-tight overflow-hidden transition-all group-[[data-collapsible=icon]]/sidebar:w-0">
                          <span className="truncate font-semibold">
                            {isLoading ? (
                              <Skeleton className="h-4 w-24" />
                            ) : profile ? (
                              `${profile.firstName} ${profile.lastName}`
                            ) : (
                              'No Profile'
                            )}
                          </span>
                          <span className="truncate text-xs">
                            {isLoading ? (
                              <Skeleton className="h-3 w-32" />
                            ) : profile?.email ? (
                              profile.email
                            ) : (
                              'No Email'
                            )}
                          </span>
                        </div>
                        <ChevronsUpDown className="ml-auto size-4 shrink-0" />
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                      side="bottom"
                      align="end"
                      sideOffset={4}
                    >
                      <VisuallyHidden>
                        <span role="heading" aria-level={1}>User Menu</span>
                      </VisuallyHidden>
                      <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                          <UserAvatar
                            profile={profile}
                            isLoading={isLoading}
                          />
                          <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">
                              {isLoading ? (
                                <Skeleton className="h-4 w-24" />
                              ) : profile ? (
                                `${profile.firstName} ${profile.lastName}`
                              ) : (
                                'No Profile'
                              )}
                            </span>
                            <span className="truncate text-xs">
                              {isLoading ? (
                                <Skeleton className="h-3 w-32" />
                              ) : profile?.email ? (
                                profile.email
                              ) : (
                                'No Email'
                              )}
                            </span>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Bell className="mr-2 h-4 w-4" />
                          Notifications
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </div>
          <SidebarRail />
        </UISidebar>
        <SidebarInset>
          <header className="fixed top-0 right-0 left-[var(--sidebar-width)] z-10 flex h-16 shrink-0 items-center gap-2 bg-background border-b transition-[width,height,left] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 group-has-[[data-collapsible=icon]]/sidebar-wrapper:left-[var(--sidebar-width-icon)]">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumbs />
            </div>
          </header>
          <div className="mt-16 p-4">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
// Export as default for dynamic import
export default Sidebar
