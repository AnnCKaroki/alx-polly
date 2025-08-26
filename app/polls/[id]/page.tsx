import { PollView } from "@/components/polls/poll-view"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface PollPageProps {
  params: { id: string }
}

export default function PollPage({ params }: PollPageProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/polls">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Polls
          </Link>
        </Button>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <PollView pollId={params.id} />
      </div>
    </div>
  )
}
