import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/services/user.service';

export async function POST(request: NextRequest) {
  try {
    const { farcasterId, userAddress } = await request.json();

    if (!farcasterId || typeof farcasterId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Farcaster ID is required' },
        { status: 400 }
      );
    }

    const result = await UserService.getOrCreateUser(farcasterId, userAddress);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Error in auth/user API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
