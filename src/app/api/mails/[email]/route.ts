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

export async function DELETE(request: NextRequest, { params }: { params: { email: string } }) {
  const email = params.email;
  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }

  try {
    const mongoClient = await getClient();
    const db = mongoClient.db('pump_watch');
    const collection = db.collection('mails');

    const result = await collection.deleteOne({ email: decodeURIComponent(email) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Email not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Email unsubscribed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to unsubscribe email:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
