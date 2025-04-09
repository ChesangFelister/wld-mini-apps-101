// app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export const dynamic = 'force-dynamic'; // Prevent static optimization

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, message: 'No token found' },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
    const { payload } = await jwtVerify(token, secret);

    if (!payload.userId) {
      return NextResponse.json(
        { authenticated: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Mock user - replace with your actual user lookup
    const user = {
      id: payload.userId,
      walletAddress: payload.walletAddress,
      username: "user_" + Math.random().toString(36).substring(2, 8),
      isNewUser: false
    };

    return NextResponse.json({
      authenticated: true,
      user
    });

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { authenticated: false, message: 'Authentication failed' },
      { status: 500 }
    );
  }
}