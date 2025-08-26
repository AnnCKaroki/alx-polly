"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Poll } from "@/types/poll"
import Link from "next/link"
import { Clock, Users, MoreHorizontal } from "lucide-react"

// Mock recent polls data
const mockRecentPolls: Poll[] = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    description: "Help us understand the community preferences",
    options: [
      { id: "1", text: "JavaScript", votes: 45 },
      { id: "2", text: "Python", votes: 38 },
      { id: "3", text: "TypeScript", votes: 42 },
    ],
    createdBy: "user1",
    createdAt: new Date("2024-01-15"),
    isActive: true,
    totalVotes: 125,
  },
  {
    id: "2",
    title: "Best time for team meetings?",
    description: "Let's find a time that works for everyone",
    options: [
      { id: "1", text: "9:00 AM", votes: 12 },
      { id: "2", text: "11:00 AM", votes: 23 },
      { id: "3", text: "2:00 PM", votes: 18 },
    ],
    createdBy: "user1",
    createdAt: new Date("2024-01-14"),
    endsAt: new Date("2024-01-20"),
    isActive: true,
    totalVotes: 53,
  },
  {
    id: "3",
    title: "Which design system should we use?",
    options: [
      { id: "1", text: "Material UI", votes: 8 },
      { id: "2", text: "Ant Design", votes: 15 },
      { id: "3", text: "Chakra UI", votes: 12 },
    ],
    createdBy: "user1",
    createdAt: new Date("2024-01-13"),
    isActive: true,
    totalVotes: 35,
  },
]

export function RecentPolls() {
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
          {mockRecentPolls.map((poll) => (
            <div key={poll.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium truncate">{poll.title}</h4>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{poll.totalVotes} votes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{poll.createdAt.toLocaleDateString()}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    poll.isActive 
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  }`}>
                    {poll.isActive ? "Active" : "Ended"}
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex gap-2 text-xs">
                    {poll.options.slice(0, 3).map((option, index) => {
                      const percentage = poll.totalVotes > 0 
                        ? Math.round((option.votes / poll.totalVotes) * 100)
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
        
        {mockRecentPolls.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No polls created yet
            </p>
            <Button asChild>
              <Link href="/polls/create">Create Your First Poll</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
