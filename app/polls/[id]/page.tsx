import { PollView } from "@/components/polls/poll-view";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PollPageProps {
  // CORRECTED: `params` is a Promise
  params: Promise<{ id: string }>;
  // CORRECTED: `searchParams` is also a Promise
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// CORRECTED: The component must be `async`
export default async function PollPage({ params, searchParams }: PollPageProps) {
  // Await both promises to get their values
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

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
        <PollView pollId={resolvedParams.id} />
      </div>
    </div>
  );
}
