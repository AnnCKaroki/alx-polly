"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Poll } from "@/types/poll"
import Link from "next/link"
import { Clock, Users, Vote } from "lucide-react"

// Mock data for development
const mockPolls: Poll[] = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    description: "Help us understand the community preferences",
    options: [
      { id: "1", text: "JavaScript", votes: 45 },
      { id: "2", text: "Python", votes: 38 },
      { id: "3", text: "TypeScript", votes: 42 },
      { id: "4", text: "Rust", votes: 15 },
    ],
    createdBy: "user1",
    createdAt: new Date("2024-01-15"),
    isActive: true,
    totalVotes: 140,
  },
  {
    id: "2",
    title: "Best time for team meetings?",
    description: "Let's find a time that works for everyone",
    options: [
      { id: "1", text: "9:00 AM", votes: 12 },
      { id: "2", text: "11:00 AM", votes: 23 },
      { id: "3", text: "2:00 PM", votes: 18 },
      { id: "4", text: "4:00 PM", votes: 7 },
    ],
    createdBy: "user2",
    createdAt: new Date("2024-01-14"),
    endsAt: new Date("2024-01-20"),
    isActive: true,
    totalVotes: 60,
  },
]

export function PollList() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchPolls = async () => {
      setIsLoading(true)
      // Simulate API delay
      setTimeout(() => {
        setPolls(mockPolls)
        setIsLoading(false)
      }, 500)
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
                <span>{poll.totalVotes} votes</span>
              </div>
              {poll.endsAt && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    Ends {poll.endsAt.toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
            
            <div className="space-y-2 mb-4">
              {poll.options.slice(0, 2).map((option) => (
                <div key={option.id} className="text-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="truncate">{option.text}</span>
                    <span className="text-muted-foreground">
                      {poll.totalVotes > 0 
                        ? Math.round((option.votes / poll.totalVotes) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{
                        width: poll.totalVotes > 0 
                          ? `${(option.votes / poll.totalVotes) * 100}%`
                          : '0%'
                      }}
                    />
                  </div>
                </div>
              ))}
              {poll.options.length > 2 && (
                <p className="text-xs text-muted-foreground">
                  +{poll.options.length - 2} more options
                </p>
              )}
            </div>
            
            <Button asChild className="w-full">
              <Link href={`/polls/${poll.id}`}>
                {poll.isActive ? "Vote Now" : "View Results"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
