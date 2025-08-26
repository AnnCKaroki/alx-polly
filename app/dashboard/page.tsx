import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentPolls } from "@/components/dashboard/recent-polls"
import { WelcomeNewUser } from "@/components/dashboard/welcome-new-user"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function DashboardPage() {
  // TODO: Replace with actual user data check
  const isNewUser = true // This would come from your auth/user state
  const hasPolls = false // This would come from your polls data

  if (isNewUser || !hasPolls) {
    return (
      <div className="container mx-auto py-8">
        <WelcomeNewUser />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your polling activity
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
        <DashboardStats />
        <RecentPolls />
      </div>
    </div>
  )
}
