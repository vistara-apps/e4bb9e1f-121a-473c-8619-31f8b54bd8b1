import { NextRequest, NextResponse } from 'next/server';
import { simplifyLegalRights } from '@/lib/openai';
import { UserService } from '@/lib/services/user.service';
import { LookupService } from '@/lib/services/lookup.service';

export async function POST(request: NextRequest) {
  try {
    const { query, userId } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user has credits
    const userResult = await UserService.getUserById(userId);
    if (!userResult.success || !userResult.data) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    if (userResult.data.paidCredits <= 0) {
      return NextResponse.json(
        { success: false, error: 'Insufficient credits', needsPayment: true },
        { status: 402 }
      );
    }

    // Deduct credit from user
    const deductResult = await UserService.deductCredits(userId, 1);
    if (!deductResult.success) {
      return NextResponse.json(
        { success: false, error: deductResult.error },
        { status: 500 }
      );
    }

    // Perform the search
    const searchResult = await simplifyLegalRights(query);
    
    // Record the lookup in history
    await LookupService.recordLookup(userId, query, searchResult);
    
    return NextResponse.json({
      success: true,
      data: searchResult,
      remainingCredits: deductResult.data?.paidCredits || 0
    });
  } catch (error) {
    console.error('Error in search-rights API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process search request' },
      { status: 500 }
    );
  }
}
