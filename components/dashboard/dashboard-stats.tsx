"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, Vote, TrendingUp, AlertCircle } from "lucide-react"
import { getDashboardStats } from "@/app/polls/actions"
import { useAuth } from "@/app/auth/context/auth-context"
import { useEffect, useState } from "react"

type DashboardStatsProps = {
  initialStats: {
    totalPolls: number
    totalVotes: number
    activePolls: number
    avgVotesPerPoll: number
  }
}

export function DashboardStats({ initialStats }: DashboardStatsProps) {
  const { session } = useAuth()
  const [stats, setStats] = useState(initialStats)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      setError(null)
      try {
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
  }, [session])

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

  if (isLoading) {
    return <div>Loading stats...</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Card for Total Polls */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Polls</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPolls}</div>
          <p className="text-xs text-muted-foreground">Your total polls created</p>
        </CardContent>
      </Card>

      {/* Card for Total Votes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
          <Vote className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalVotes}</div>
          <p className="text-xs text-muted-foreground">Total votes across your polls</p>
        </CardContent>
      </Card>

      {/* Card for Active Polls */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Polls</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activePolls}</div>
          <p className="text-xs text-muted-foreground">Currently accepting votes</p>
        </CardContent>
      </Card>

      {/* Card for Avg Votes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Votes/Poll</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgVotesPerPoll.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Average votes per poll</p>
        </CardContent>
      </Card>
    </div>
  )
}
