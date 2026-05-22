import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const userId = searchParams.get('userId') || 'guest';

    const where: Record<string, unknown> = { userId };

    if (date) {
      where.date = date;
    }

    const waterEntries = await db.waterEntry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(waterEntries);
  } catch (error) {
    console.error('Error fetching water entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch water entries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { glasses, date, userId } = body;

    const waterEntry = await db.waterEntry.create({
      data: {
        glasses: glasses ?? 0,
        date: date ?? new Date().toISOString().split('T')[0],
        userId: userId ?? 'guest',
      },
    });

    return NextResponse.json(waterEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating water entry:', error);
    return NextResponse.json(
      { error: 'Failed to create water entry' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { glasses, date, userId } = body;

    const targetDate = date ?? new Date().toISOString().split('T')[0];
    const targetUserId = userId ?? 'guest';

    // Find existing entry for this date and user
    const existing = await db.waterEntry.findFirst({
      where: { date: targetDate, userId: targetUserId },
    });

    if (existing) {
      const updated = await db.waterEntry.update({
        where: { id: existing.id },
        data: { glasses: glasses ?? 0 },
      });
      return NextResponse.json(updated);
    } else {
      const created = await db.waterEntry.create({
        data: {
          glasses: glasses ?? 0,
          date: targetDate,
          userId: targetUserId,
        },
      });
      return NextResponse.json(created, { status: 201 });
    }
  } catch (error) {
    console.error('Error updating water entry:', error);
    return NextResponse.json(
      { error: 'Failed to update water entry' },
      { status: 500 }
    );
  }
}
