import { vote } from '@/app/polls/actions';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pollId = params.id;
    const { optionId } = await request.json();
    await vote(pollId, optionId);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error submitting vote:", error);
    if (error.message.includes("You must be logged in")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: error.message || 'Failed to submit vote' }, { status: 400 });
  }
}
