"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, Vote, TrendingUp, AlertCircle } from "lucide-react"
import { getDashboardStats } from "@/app/polls/actions"
import { useAuth } from "@/app/auth/context/auth-context"
import { useEffect, useState } from "react"

export function DashboardStats() {
  const { session } = useAuth()
  const [stats, setStats] = useState({
    totalPolls: 0,
    totalVotes: 0,
    activePolls: 0,
    avgVotesPerPoll: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // No need to pass session here, getDashboardStats fetches it internally
        const dashboardStats = await getDashboardStats()
        setStats(dashboardStats)
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err)
        setError("Failed to load dashboard stats.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [session]) // Keep session as dependency to re-run when session changes

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-3 bg-muted rounded w-1/4 mt-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="col-span-full">
        <CardContent className="p-6 text-center text-destructive flex items-center justify-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Polls</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPolls}</div>
          <p className="text-xs text-muted-foreground">
            Your total polls created
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
          <Vote className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalVotes}</div>
          <p className="text-xs text-muted-foreground">
            Total votes across your polls
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Polls</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activePolls}</div>
          <p className="text-xs text-muted-foreground">
            Currently accepting votes
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Votes/Poll</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgVotesPerPoll.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Average votes per poll
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
