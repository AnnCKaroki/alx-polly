import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type RecentPollsProps = {
  initialPolls: {
    id: string
    title: string
    created_at: string
  }[]
}

export function RecentPolls({ initialPolls }: RecentPollsProps) {
  if (!initialPolls?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Polls</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No polls created yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Polls</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {initialPolls.map((poll) => (
            <li key={poll.id}>
              <Link
                href={`/polls/${poll.id}`}
                className="text-blue-600 hover:underline"
              >
                {poll.title}
              </Link>
              <span className="ml-2 text-sm text-muted-foreground">
                {new Date(poll.created_at).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
