import { Sidebar } from "@/components/layout/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-paper">
      <Sidebar />
      <main className="ml-56 flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
