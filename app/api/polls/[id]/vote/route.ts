// app/api/polls/[id]/vote/route.ts

import { vote } from '@/app/polls/actions'; // Import the vote server action
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const pollId = params.id;
    const { optionId } = await request.json();

    // Call the server action to submit the vote
    await vote(pollId, optionId);

    // Return a success response
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error submitting vote:", error);

    // Check for specific errors and return appropriate status codes
    if (error.message.includes("You must be logged in")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // For other errors (e.g., database issues, bad data), return a 400 or 500
    return NextResponse.json({ error: error.message || 'Failed to submit vote' }, { status: 400 });
  }
}
