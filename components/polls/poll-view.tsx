'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/auth/context/auth-context"
import { Clock, Users, Share2, AlertCircle } from "lucide-react"
import { Poll } from "@/types/poll"

interface PollViewProps {
  pollId: string;
  initialPoll?: Poll; // Add an optional prop for initial data
}

export function PollView({ pollId, initialPoll }: PollViewProps) {
  const { session } = useAuth();
  const router = useRouter();
  const [poll, setPoll] = useState<Poll | null>(initialPoll || null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userHasVoted, setUserHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialPoll); // Set isLoading based on initial data presence
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchPoll = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/polls/${pollId}`);
        if (!res.ok) {
          throw new Error('Failed to load poll.');
        }
        const fetchedPoll = await res.json();
        if (!isMounted) return;
        setPoll(fetchedPoll as Poll);

        // Check if user has voted
        let userVoted = false;
        if (session && session.user && fetchedPoll) {
          const voteRes = await fetch(`/api/polls/${pollId}/has-voted?userId=${session.user.id}`);
          if (voteRes.ok) {
            const { hasVoted } = await voteRes.json();
            userVoted = hasVoted;
          }
        }
        if (isMounted) setUserHasVoted(userVoted);
      } catch (err) {
        if (isMounted) {
          console.error("Failed to fetch poll:", err);
          setError("Failed to load poll. It might not exist or an error occurred.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    // Only fetch if initial data isn't provided
    if (!initialPoll) {
      fetchPoll();
    }

    return () => { isMounted = false; };
  }, [pollId, session, initialPoll]); // Add initialPoll to the dependency array

  const handleVote = async () => {
    if (!selectedOption || !poll) return;
    setIsVoting(true);
    setError(null);
    try {
      const res = await fetch(`/api/polls/${poll.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId: selectedOption })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit vote.');
      }
      // Refresh poll data
      const pollRes = await fetch(`/api/polls/${pollId}`);
      const updatedPoll = await pollRes.json();
      setPoll(updatedPoll as Poll);
      setUserHasVoted(true);
    } catch (err) {
      console.error("Failed to submit vote:", err);
      setError("Failed to submit your vote. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  const handleShare = async () => {
    setShareMessage(null)
    if (navigator.share) {
      try {
        await navigator.share({
          title: poll?.title || "Check out this poll",
          url: window.location.href,
        })
        setShareMessage("Poll shared successfully!")
      } catch (error) {
        console.log("Error sharing:", error)
        setShareMessage("Failed to share poll.")
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        setShareMessage("Poll link copied to clipboard!")
      } catch (err) {
        console.error("Failed to copy link:", err)
        setShareMessage("Failed to copy poll link.")
      }
    }
    setTimeout(() => setShareMessage(null), 3000)
  }

  const handleDelete = async () => {
    if (!poll) return
    setIsDeleting(true)
    setError(null)
    try {
      const res = await fetch(`/api/polls/${poll.id}/delete`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete poll')
      }
      router.push('/polls')
    } catch (err: any) {
      setError(err.message || 'Failed to delete poll')
    } finally {
      setIsDeleting(false)
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

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-destructive flex items-center justify-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
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

  // Only declare these once, after poll is loaded
  const isExpired = poll.endsAt ? new Date() > new Date(poll.endsAt) : false;
  const canVote = !isExpired && !userHasVoted;
  const totalVotes = poll.votes?.length || 0;
  const isOwner = Boolean(session && session.user && poll.createdBy && session.user.id === poll.createdBy);

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
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            {isOwner && (
              <Button variant="destructive" size="icon" onClick={handleDelete} disabled={isDeleting} title="Delete Poll">
                {isDeleting ? (
                  <span className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full inline-block" />
                ) : (
                  <span className="font-bold">×</span>
                )}
              </Button>
            )}
          </div>
        </div>

        {shareMessage && (
          <div className="mt-2 text-center text-sm text-muted-foreground">
            {shareMessage}
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{totalVotes} votes</span>
          </div>
          <div>Created {new Date(poll.createdAt).toLocaleDateString()}</div>
          {poll.endsAt && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>
                {isExpired ? "Ended" : "Ends"} {new Date(poll.endsAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {poll.options.map((option) => {
            const optionVotes = poll.votes.filter(vote => vote.optionId === option.id).length
            const percentage = totalVotes > 0
              ? Math.round((optionVotes / totalVotes) * 100)
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
                        {optionVotes} votes
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

        {userHasVoted && (
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
