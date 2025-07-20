
'use server';

import { MongoClient, ServerApiVersion } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

async function withDb(dbOperation: (db: any) => Promise<NextResponse>) {
  let client;
  try {
    client = new MongoClient(MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await client.connect();
    const db = client.db('pumpwatch'); // Use the database name from the connection string
    return await dbOperation(db);
  } catch (error) {
    console.error('Database operation failed:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, walletAddress, txid, pwAmount } = await request.json();

    if (!email || !walletAddress || !txid || pwAmount === undefined) {
      return NextResponse.json({ message: 'Email, wallet address, txid, and pwAmount are required' }, { status: 400 });
    }

    return await withDb(async (db) => {
      const collection = db.collection('mails');
      await collection.updateOne(
        { walletAddress, email },
        { $set: { 
            walletAddress, 
            email, 
            txid,
            pwAmount,
            subscribedAt: new Date(),
            status: 'active'
          } 
        },
        { upsert: true }
      );
      return NextResponse.json({ message: 'Email subscribed successfully' }, { status: 201 });
    });
  } catch (error) {
    console.error('Failed to parse request or subscribe email:', error);
    // This catches errors from request.json() if the body is malformed.
    return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get('walletAddress');

  if (!walletAddress) {
    return NextResponse.json({ message: 'Wallet address is required' }, { status: 400 });
  }

  return await withDb(async (db) => {
    const collection = db.collection('mails');
    const subscription = await collection.findOne({ walletAddress });

    if (!subscription) {
      return NextResponse.json({ message: 'Subscription not found' }, { status: 404 });
    }
    return NextResponse.json(subscription, { status: 200 });
  });
}
