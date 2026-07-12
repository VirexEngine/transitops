import { Sidebar } from '@/components/dashboard/sidebar'
import { TopNav } from '@/components/dashboard/topnav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // TODO: Re-enable auth check after login is working
  // const session = await getServerSession()
  // if (!session) {
  //   redirect('/login')
  // }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
