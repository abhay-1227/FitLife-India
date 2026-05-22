import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const userId = searchParams.get('userId');

    const where: Record<string, unknown> = {};

    if (date) {
      where.date = date;
    }

    if (userId) {
      where.userId = userId;
    }

    const foodEntries = await db.foodEntry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(foodEntries);
  } catch (error) {
    console.error('Error fetching food entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch food entries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const bodyText = await request.text();
    const body = JSON.parse(bodyText);

    const { name, calories, protein, carbs, fats, fiber, sugar, sodium, date, userId } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      );
    }

    const foodEntry = await db.foodEntry.create({
      data: {
        name,
        calories: calories ?? 0,
        protein: protein ?? 0,
        carbs: carbs ?? 0,
        fats: fats ?? 0,
        fiber: fiber ?? 0,
        sugar: sugar ?? 0,
        sodium: sodium ?? 0,
        date: date ?? new Date().toISOString().split('T')[0],
        userId: userId ?? 'guest',
      },
    });

    return NextResponse.json(foodEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating food entry:', error);
    return NextResponse.json(
      { error: 'Failed to create food entry' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    await db.foodEntry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting food entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete food entry' },
      { status: 500 }
    );
  }
}
