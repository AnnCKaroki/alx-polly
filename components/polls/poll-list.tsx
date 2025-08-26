"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Poll } from "@/types/poll"
import Link from "next/link"
import { Clock, Users, Vote, AlertCircle } from "lucide-react"

import { getAllPolls } from "@/app/polls/actions"

export function PollList() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPolls = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const allPolls = await getAllPolls()
        setPolls(allPolls as Poll[])
      } catch (err) {
        console.error("Failed to fetch polls:", err)
        setError("Failed to load polls.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPolls()
  }, [])

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
          <Vote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No polls yet</h3>
          <p className="text-muted-foreground mb-4">
            Be the first to create a poll and get the conversation started!
          </p>
          <Button asChild>
            <Link href="/polls/create">Create Your First Poll</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {polls.map((poll) => (
        <Card key={poll.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg line-clamp-2">{poll.title}</CardTitle>
            {poll.description && (
              <CardDescription className="line-clamp-2">
                {poll.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{poll.votes.length} votes</span>
              </div>
              {poll.endsAt && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    Ends {new Date(poll.endsAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2 mb-4">
              {poll.options.slice(0, 2).map((option) => {
                const optionVotes = poll.votes.filter(vote => vote.optionId === option.id).length
                const percentage = poll.votes.length > 0
                  ? Math.round((optionVotes / poll.votes.length) * 100)
                  : 0
                return (
                  <div key={option.id} className="text-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="truncate">{option.text}</span>
                      <span className="text-muted-foreground">
                        {percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{
                          width: poll.votes.length > 0
                            ? `${(optionVotes / poll.votes.length) * 100}%`
                            : '0%'
                        }}
                      />
                    </div>
                  </div>
                )
              })}
              {poll.options.length > 2 && (
                <p className="text-xs text-muted-foreground">
                  +{poll.options.length - 2} more options
                </p>
              )}
            </div>

            <Button asChild className="w-full">
              <Link href={`/polls/${poll.id}`}>
                {poll.endsAt && new Date(poll.endsAt) < new Date() ? "View Results" : "Vote Now"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
