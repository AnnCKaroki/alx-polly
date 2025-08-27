import { createPoll } from '@/app/polls/actions';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const pollData = await request.json();
    const newPoll = await createPoll(pollData);
    return NextResponse.json(newPoll, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create poll:", error);
    if (error.message.includes("You must be logged in")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error.message.includes("at least two valid options") || error.message.includes("cannot be empty")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create poll' }, { status: 500 });
  }
}
