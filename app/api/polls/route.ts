// app/api/polls/[id]/route.ts

import { deletePoll, getPollById } from '@/app/polls/actions';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pollId = params.id;
    // The asynchronous call (getPollById) is inside the function body
    const poll = await getPollById(pollId);

    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    return NextResponse.json(poll);
  } catch (error: any) {
    console.error("Error fetching poll:", error);
    return NextResponse.json({ error: 'Failed to fetch poll' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pollId = params.id;
    // The asynchronous call (deletePoll) is inside the function body
    await deletePoll(pollId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete poll' }, { status: 400 });
  }
}
