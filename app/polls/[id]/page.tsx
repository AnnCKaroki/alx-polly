import { PollView } from "@/components/polls/poll-view";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PollPageProps {
  // Update the type to reflect the change in Next.js 15
  params: Promise<{ id: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

// Mark the component as async to use await
export default async function PollPage({ params }: PollPageProps) {
  // Await the params to get the value
  const resolvedParams = await params;

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
        {/* Pass the ID from the resolved object */}
        <PollView pollId={resolvedParams.id} />
      </div>
    </div>
  );
}
