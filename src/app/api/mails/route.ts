
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

let ttlIndexDropped = false;

async function ensureTtlIndexDropped(collection: any) {
    if (ttlIndexDropped) {
        return;
    }
    try {
        // Attempt to drop a potential TTL index on 'subscribedAt'.
        // The default name for an index on this field would be 'subscribedAt_1'.
        await collection.dropIndex("subscribedAt_1");
        console.log("Successfully dropped TTL index 'subscribedAt_1' from 'mails' collection.");
        ttlIndexDropped = true;
    } catch (error: any) {
        // This is expected if the index doesn't exist. We can ignore the error.
        if (error.codeName === 'IndexNotFound') {
            console.log("TTL index 'subscribedAt_1' not found on 'mails' collection. No action needed.");
        } else {
            console.warn("Could not drop TTL index, it might not exist or another error occurred:", error.message);
        }
        // Mark as "dropped" to prevent re-trying on every request.
        ttlIndexDropped = true; 
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
      
      // Ensure any old TTL index is removed to make data permanent.
      await ensureTtlIndexDropped(collection);

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
