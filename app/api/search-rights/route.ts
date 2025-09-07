import { NextRequest, NextResponse } from 'next/server';
import { simplifyLegalRights } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    const result = await simplifyLegalRights(query);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in search-rights API:', error);
    return NextResponse.json(
      { error: 'Failed to process search request' },
      { status: 500 }
    );
  }
}
