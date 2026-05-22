import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') ?? 'guest';
    const limit = parseInt(searchParams.get('limit') ?? '5', 10);

    const sessions = await db.yogaSession.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      take: limit,
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching yoga sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch yoga sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const bodyText = await request.text();
    const body = bodyText ? JSON.parse(bodyText) : {};

    const { name, duration, posesCount, userId } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Session name is required' },
        { status: 400 }
      );
    }

    const session = await db.yogaSession.create({
      data: {
        name,
        duration: duration ?? 0,
        posesCount: posesCount ?? 0,
        userId: userId ?? 'guest',
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error('Error creating yoga session:', error);
    return NextResponse.json(
      { error: 'Failed to create yoga session' },
      { status: 500 }
    );
  }
}
