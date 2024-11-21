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
} from "./ui/avatar"
import { Breadcrumbs } from "./breadcrumbs"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
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
} from "./ui/sidebar"
import { Separator } from "./ui/separator"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "./ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

const data = {
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  navMain: [
    {
      title: "Home",
      url: "/home",
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
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error logging out:', error)
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
                        <Avatar className="h-8 w-8 rounded-lg shrink-0">
                          <AvatarImage
                            src={data.user.avatar || ''}
                            alt={data.user.name || 'User'}
                          />
                          <AvatarFallback className="rounded-lg">
                            {data.user.name ? data.user.name.slice(0,2).toUpperCase() : 'JD'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight overflow-hidden transition-all group-[[data-collapsible=icon]]/sidebar:w-0">
                          <span className="truncate font-semibold">
                            {data.user.name || 'User'}
                          </span>
                          <span className="truncate text-xs">
                            {data.user.email || 'user@example.com'}
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
                          <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage
                              src={data.user.avatar || ''}
                              alt={data.user.name || 'User'}
                            />
                            <AvatarFallback className="rounded-lg">
                              {data.user.name ? data.user.name.slice(0,2).toUpperCase() : 'JD'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">
                              {data.user.name || 'User'}
                            </span>
                            <span className="truncate text-xs">
                              {data.user.email || 'user@example.com'}
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
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumbs />
            </div>
          </header>
          <div className="p-4">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

// Export as default for dynamic import
export default Sidebar
