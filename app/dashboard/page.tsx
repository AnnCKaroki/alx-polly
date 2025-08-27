// app/dashboard/page.tsx
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import {RecentPolls} from "@/components/dashboard/recent-polls"
import { WelcomeNewUser } from "@/components/dashboard/welcome-new-user"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getRecentPolls, getDashboardStats } from "@/app/polls/actions"


export default async function DashboardPage() {
  // Server-side authentication check (secure)
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  const [recentPolls, stats] = await Promise.all([
    getRecentPolls(),
    getDashboardStats(),
  ])

  const hasPolls = recentPolls.length > 0

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back 👋
          </p>
        </div>
        <Button asChild>
          <Link href="/polls/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Poll
          </Link>
        </Button>
      </div>

      <div className="space-y-8">
        {!hasPolls ? (
          <WelcomeNewUser />
        ) : (
          <>
            {/* Pass preloaded stats and polls as props */}
            <DashboardStats initialStats={stats} />
            <RecentPolls initialPolls={recentPolls} />
          </>
        )}
      </div>
    </div>
  )
}
