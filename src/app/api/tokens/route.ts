import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(request: Request) {
  try {
    const response = await fetch('https://studio--api-navigator-1owsj.us-central1.hosted.app/api/rsi', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from external API: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ message: 'Error fetching data' }, { status: 500 });
  }
}
