import { vote } from '@/app/polls/actions';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { optionId } = await request.json();
    await vote(id, optionId);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error submitting vote:", error);
    if (error.message.includes("You must be logged in")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: error.message || 'Failed to submit vote' }, { status: 400 });
  }
}
