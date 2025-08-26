"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Poll } from "@/types/poll"
import { Clock, Users, Share2 } from "lucide-react"

interface PollViewProps {
  pollId: string
}

// Mock poll data for development
const mockPoll: Poll = {
  id: "1",
  title: "What's your favorite programming language?",
  description: "Help us understand the community preferences for our next project stack",
  options: [
    { id: "1", text: "JavaScript", votes: 45 },
    { id: "2", text: "Python", votes: 38 },
    { id: "3", text: "TypeScript", votes: 42 },
    { id: "4", text: "Rust", votes: 15 },
    { id: "5", text: "Go", votes: 23 },
  ],
  createdBy: "user1",
  createdAt: new Date("2024-01-15"),
  isActive: true,
  totalVotes: 163,
}

export function PollView({ pollId }: PollViewProps) {
  const [poll, setPoll] = useState<Poll | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isVoting, setIsVoting] = useState(false)

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchPoll = async () => {
      setIsLoading(true)
      // Simulate API delay
      setTimeout(() => {
        setPoll(mockPoll)
        setIsLoading(false)
        // TODO: Check if user has already voted
        setHasVoted(false)
      }, 500)
    }

    fetchPoll()
  }, [pollId])

  const handleVote = async () => {
    if (!selectedOption || !poll) return
    
    setIsVoting(true)
    
    // TODO: Implement actual voting logic
    console.log("Voting for option:", selectedOption)
    
    // Simulate API call
    setTimeout(() => {
      setHasVoted(true)
      setIsVoting(false)
      // TODO: Update poll data with new vote counts
    }, 500)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: poll?.title || "Check out this poll",
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href)
      alert("Poll link copied to clipboard!")
    }
  }

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-2 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!poll) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">Poll not found</h3>
          <p className="text-muted-foreground">
            The poll you're looking for doesn't exist or has been removed.
          </p>
        </CardContent>
      </Card>
    )
  }

  const isExpired = poll.endsAt && new Date() > poll.endsAt
  const canVote = poll.isActive && !isExpired && !hasVoted

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl">{poll.title}</CardTitle>
            {poll.description && (
              <CardDescription className="text-base">
                {poll.description}
              </CardDescription>
            )}
          </div>
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{poll.totalVotes} votes</span>
          </div>
          <div>Created {poll.createdAt.toLocaleDateString()}</div>
          {poll.endsAt && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>
                {isExpired ? "Ended" : "Ends"} {poll.endsAt.toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {poll.options.map((option) => {
            const percentage = poll.totalVotes > 0 
              ? Math.round((option.votes / poll.totalVotes) * 100)
              : 0
            
            return (
              <div key={option.id} className="space-y-2">
                <div 
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    canVote
                      ? selectedOption === option.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                      : "border-border"
                  }`}
                  onClick={() => canVote && setSelectedOption(option.id)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{option.text}</span>
                    <div className="text-right">
                      <div className="font-semibold">{percentage}%</div>
                      <div className="text-sm text-muted-foreground">
                        {option.votes} votes
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2 w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {canVote && (
          <div className="mt-6">
            <Button 
              onClick={handleVote} 
              disabled={!selectedOption || isVoting}
              className="w-full"
            >
              {isVoting ? "Submitting Vote..." : "Submit Vote"}
            </Button>
          </div>
        )}
        
        {hasVoted && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <p className="text-green-700 dark:text-green-300 font-medium">
              ✓ Thank you for voting!
            </p>
          </div>
        )}
        
        {isExpired && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-muted-foreground">
              This poll has ended and is no longer accepting votes.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
