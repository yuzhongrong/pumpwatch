import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic' // defaults to auto

const API_BASE_URL = process.env.API_BASE_URL;

export async function GET(request: Request) {
  if (!API_BASE_URL) {
    console.error('API_BASE_URL environment variable is not set');
    return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/rsi`, {
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
