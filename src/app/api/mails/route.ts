'use server';

import { MongoClient, ServerApiVersion } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let client: MongoClient;

async function getClient() {
  if (!client) {
    client = new MongoClient(MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await client.connect();
  }
  return client;
}

export async function POST(request: NextRequest) {
  try {
    const { email, walletAddress } = await request.json();

    if (!email || !walletAddress) {
      return NextResponse.json({ message: 'Email and wallet address are required' }, { status: 400 });
    }

    const mongoClient = await getClient();
    const db = mongoClient.db('pump_watch');
    const collection = db.collection('mails');
    
    await collection.updateOne(
      { walletAddress, email },
      { $set: { walletAddress, email, subscribedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ message: 'Email subscribed successfully' }, { status: 201 });
  } catch (error) {
    console.error('Failed to subscribe email:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get('walletAddress');

  if (!walletAddress) {
    return NextResponse.json({ message: 'Wallet address is required' }, { status: 400 });
  }

  try {
    const mongoClient = await getClient();
    const db = mongoClient.db('pump_watch');
    const collection = db.collection('mails');

    const subscription = await collection.findOne({ walletAddress });

    if (!subscription) {
      return NextResponse.json({ message: 'Email not found' }, { status: 404 });
    }

    return NextResponse.json({ email: subscription.email }, { status: 200 });
  } catch (error) {
    console.error('Failed to get email:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
