"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Poll } from "@/types/poll"
import Link from "next/link"
import { Clock, Users, AlertCircle } from "lucide-react"
import { getRecentPolls } from "@/app/polls/actions"
import { useAuth } from "@/app/auth/context/auth-context"

export function RecentPolls() {
  const { session } = useAuth()
  const [polls, setPolls] = useState<Poll[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPolls = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // No need to pass session here, getRecentPolls fetches it internally
        const recentPolls = await getRecentPolls()
        setPolls(recentPolls as Poll[])
      } catch (err) {
        console.error("Failed to fetch recent polls:", err)
        setError("Failed to load recent polls.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPolls()
  }, [session]) // Keep session as dependency to re-run when session changes

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded"></div>
              </div>
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

  if (polls.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No recent polls</h3>
          <p className="text-muted-foreground mb-4">
            You haven't created any polls yet. Create one to see it here!
          </p>
          <Button asChild>
            <Link href="/polls/create">Create Your First Poll</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Polls</CardTitle>
          <CardDescription>
            Your latest polls and their performance
          </CardDescription>
        </div>
        <Button asChild variant="outline">
          <Link href="/polls">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {polls.map((poll) => (
            <div key={poll.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium truncate">{poll.title}</h4>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{poll.votes.length} votes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(poll.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${poll.endsAt && new Date(poll.endsAt) < new Date() ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"}`}>
                    {poll.endsAt && new Date(poll.endsAt) < new Date() ? "Ended" : "Active"}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex gap-2 text-xs">
                    {poll.options.slice(0, 3).map((option, index) => {
                      const optionVotes = poll.votes.filter(vote => vote.optionId === option.id).length
                      const percentage = poll.votes.length > 0
                        ? Math.round((optionVotes / poll.votes.length) * 100)
                        : 0
                      return (
                        <div key={option.id} className="flex items-center gap-1">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: `hsl(${index * 120}, 70%, 50%)` }}
                          />
                          <span>{option.text}: {percentage}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="ml-4 flex flex-col gap-2">
                <Button asChild size="sm">
                  <Link href={`/polls/${poll.id}`}>View</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* This condition is now redundant due to the early return above */}
        {/* {mockRecentPolls.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No polls created yet
            </p>
            <Button asChild>
              <Link href="/polls/create">Create Your First Poll</Link>
            </Button>
          </div>
        )} */}
      </CardContent>
    </Card>
  )
}
