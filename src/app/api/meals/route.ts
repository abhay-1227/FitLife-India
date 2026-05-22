import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const day = searchParams.get('day');
    const mealType = searchParams.get('mealType');
    const userId = searchParams.get('userId');

    const where: Record<string, unknown> = {};

    if (day) {
      where.day = day;
    }

    if (mealType) {
      where.mealType = mealType;
    }

    if (userId) {
      where.userId = userId;
    }

    const mealPlans = await db.mealPlan.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(mealPlans);
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meal plans' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const bodyText = await request.text();
    const body = JSON.parse(bodyText);

    const { day, mealType, foods, calories, protein, carbs, fats, userId } = body;

    if (!day || !mealType) {
      return NextResponse.json(
        { error: 'Missing required fields: day, mealType' },
        { status: 400 }
      );
    }

    // Upsert: delete existing meal plan for same day+mealType+userId, then create new
    await db.mealPlan.deleteMany({
      where: { day, mealType, userId: userId ?? 'guest' },
    });

    const mealPlan = await db.mealPlan.create({
      data: {
        day,
        mealType,
        foods: foods ?? '[]',
        calories: calories ?? 0,
        protein: protein ?? 0,
        carbs: carbs ?? 0,
        fats: fats ?? 0,
        userId: userId ?? 'guest',
      },
    });

    return NextResponse.json(mealPlan, { status: 201 });
  } catch (error) {
    console.error('Error creating meal plan:', error);
    return NextResponse.json(
      { error: 'Failed to create meal plan' },
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

    await db.mealPlan.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting meal plan:', error);
    return NextResponse.json(
      { error: 'Failed to delete meal plan' },
      { status: 500 }
    );
  }
}
