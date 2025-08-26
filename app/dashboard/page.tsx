'use client'

import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentPolls } from "@/components/dashboard/recent-polls"
import { WelcomeNewUser } from "@/components/dashboard/welcome-new-user"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { withAuth } from "@/app/auth/with-auth"
import { useAuth } from "@/app/auth/context/auth-context"
import { useEffect, useState } from "react"
import { getRecentPolls } from "@/app/polls/actions"

function DashboardPage() {
  const { session } = useAuth()
  const [hasPolls, setHasPolls] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkPolls = async () => {
      // No need to pass session here, getRecentPolls fetches it internally
      const recentPolls = await getRecentPolls()
      setHasPolls(recentPolls.length > 0)
      setIsLoading(false)
    }
    checkPolls()
  }, [session]) // Keep session as dependency to re-run when session changes

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p>Loading dashboard...</p>
      </div>
    )
  }

  if (!hasPolls) {
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
            Welcome, {session?.user?.user_metadata.full_name}!
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

export default withAuth(DashboardPage)
