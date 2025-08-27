import { deletePoll, getPollById } from '@/app/polls/actions';
import { NextResponse } from 'next/server';

// GET handler to fetch a single poll
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const pollId = params.id;
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

// DELETE handler to delete a poll
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const pollId = params.id;
    await deletePoll(pollId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete poll' }, { status: 400 });
  }
}
