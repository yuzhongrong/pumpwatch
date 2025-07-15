import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Token from '@/models/token';

const API_URL = 'https://dexscreen-scraper-delta.vercel.app/dex?generated_text=%26filters%5BmarketCap%5D%5Bmin%5D%3D2000000%26filters%5BchainIds%5D%5B0%5D%3Dsolana';

export async function GET() {
  try {
    await dbConnect();

    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch from API: ${response.statusText}`);
    }
    const apiData = await response.json();

    if (!apiData || !apiData.data || !Array.isArray(apiData.data)) {
        return NextResponse.json({ success: false, message: 'Invalid API response structure' }, { status: 400 });
    }

    const validTokens = apiData.data.filter((item: any) => !item.Error && item.pairAddress);

    const operations = validTokens.map((tokenData: any) => {
        const filteredData = {
            pairAddress: tokenData.pairAddress,
            baseToken: tokenData.baseToken,
            priceUsd: tokenData.priceUsd,
            txns: tokenData.txns,
            volume: tokenData.volume,
            priceChange: tokenData.priceChange,
            marketCap: tokenData.marketCap,
            pairCreatedAt: tokenData.pairCreatedAt,
            info: tokenData.info
        };

        return {
            updateOne: {
                filter: { pairAddress: tokenData.pairAddress },
                update: { $set: filteredData },
                upsert: true,
            },
        };
    });
    
    if (operations.length > 0) {
        await Token.bulkWrite(operations);
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully synced ${operations.length} tokens.`,
    });
  } catch (error) {
    console.error('Error syncing tokens:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: 'Error syncing tokens', error: errorMessage }, { status: 500 });
  }
}
