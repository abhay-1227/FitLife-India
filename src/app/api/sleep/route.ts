import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const userId = searchParams.get('userId') || 'guest';
    const days = parseInt(searchParams.get('days') || '7', 10);

    const where: Record<string, unknown> = { userId };

    if (date) {
      where.date = date;
    }

    const sleepEntries = await db.sleepEntry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: days,
    });

    return NextResponse.json(sleepEntries);
  } catch (error) {
    console.error('Error fetching sleep entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sleep entries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bedtime, wakeTime, duration, quality, date, userId } = body;

    if (!bedtime || !wakeTime) {
      return NextResponse.json(
        { error: 'Bedtime and wake time are required' },
        { status: 400 }
      );
    }

    const sleepEntry = await db.sleepEntry.create({
      data: {
        bedtime,
        wakeTime,
        duration: duration ?? 0,
        quality: quality ?? 3,
        date: date ?? new Date().toISOString().split('T')[0],
        userId: userId ?? 'guest',
      },
    });

    return NextResponse.json(sleepEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating sleep entry:', error);
    return NextResponse.json(
      { error: 'Failed to create sleep entry' },
      { status: 500 }
    );
  }
}
