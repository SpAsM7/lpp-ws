import { Sidebar } from "@/components/layout/main-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar>{children}</Sidebar>
    </div>
  )
}
