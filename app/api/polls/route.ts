// app/api/polls/[id]/route.ts

import { deletePoll, getPollById } from '@/app/polls/actions';
import { NextResponse, NextRequest } from 'next/server';

// ...existing code...
import { getAllPolls } from '@/app/polls/actions';

export async function GET(request: NextRequest) {
  try {
    const polls = await getAllPolls();
    return NextResponse.json(polls);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch polls' }, { status: 500 });
  }
}

// ...existing code...
// DELETE is not typically implemented for a collection route. If needed, implement accordingly.
