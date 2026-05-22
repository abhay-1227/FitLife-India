import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const defaultPoses = [
  {
    name: 'Surya Namaskar',
    sanskrit: 'Sūrya Namaskāra',
    category: 'yoga',
    difficulty: 'beginner',
    description: 'A flowing sequence of 12 linked asanas that form a complete warm-up and cardiovascular workout, honoring the sun.',
    duration: '15 min',
    benefits: 'Improves cardiovascular health,Enhances flexibility of the entire body,Stimulates digestive system,Boosts energy and vitality,Tones muscles and joints',
    image: '',
  },
  {
    name: 'Padmasana',
    sanskrit: 'Padmāsana',
    category: 'yoga',
    difficulty: 'beginner',
    description: 'The classic cross-legged meditation posture that calms the mind and opens the hips for deep contemplation.',
    duration: '10 min',
    benefits: 'Calms the mind and reduces stress,Opens hips and stretches ankles,Improves posture and spinal alignment,Stimulates digestion,Prepares body for meditation',
    image: '',
  },
  {
    name: 'Vrikshasana',
    sanskrit: 'Vṛkṣāsana',
    category: 'yoga',
    difficulty: 'intermediate',
    description: 'The Tree Pose cultivates balance, focus, and grounding energy — standing tall like a steadfast tree.',
    duration: '5 min',
    benefits: 'Improves balance and stability,Strengthens legs and core,Opens hips and stretches groins,Enhances concentration,Builds mental fortitude',
    image: '',
  },
  {
    name: 'Bhujangasana',
    sanskrit: 'Bhujaṅgāsana',
    category: 'yoga',
    difficulty: 'beginner',
    description: 'Cobra Pose opens the chest, strengthens the spine, and mimics the raised hood of a cobra — a powerful heart opener.',
    duration: '5 min',
    benefits: 'Strengthens spine and back muscles,Opens chest and lungs,Stimulates abdominal organs,Relieves stress and fatigue,Improves posture',
    image: '',
  },
  {
    name: 'Tadasana',
    sanskrit: 'Tāḍāsana',
    category: 'yoga',
    difficulty: 'beginner',
    description: 'Mountain Pose — the foundation of all standing poses. Teaches correct posture and conscious breathing.',
    duration: '5 min',
    benefits: 'Improves posture and alignment,Strengthens thighs and ankles,Increases body awareness,Calms the nervous system,Improves circulation',
    image: '',
  },
  {
    name: 'Trikonasana',
    sanskrit: 'Trikonāsana',
    category: 'yoga',
    difficulty: 'intermediate',
    description: 'Triangle Pose stretches the entire side body, strengthens legs, and improves balance through geometric alignment.',
    duration: '5 min',
    benefits: 'Stretches hips groins and hamstrings,Strengthens legs and core,Stimulates abdominal organs,Improves balance and stability,Relieves back pain',
    image: '',
  },
  {
    name: 'Anulom Vilom',
    sanskrit: 'Anuloma Viloma',
    category: 'pranayama',
    difficulty: 'beginner',
    description: 'Alternate Nostril Breathing — the cornerstone pranayama technique that balances the left and right energy channels.',
    duration: '10 min',
    benefits: 'Balances left and right brain hemispheres,Calms the nervous system,Improves respiratory function,Reduces anxiety and stress,Enhances concentration',
    image: '',
  },
  {
    name: 'Kapalbhati',
    sanskrit: 'Kapālabhāti',
    category: 'pranayama',
    difficulty: 'intermediate',
    description: 'Skull Shining Breath — a powerful cleansing technique with rapid exhalations that energize the body and clear the mind.',
    duration: '10 min',
    benefits: 'Cleanses respiratory passages,Energizes the nervous system,Improves digestion and metabolism,Strengthens abdominal muscles,Clears mental fog',
    image: '',
  },
  {
    name: 'Bhramari',
    sanskrit: 'Bhramarī',
    category: 'pranayama',
    difficulty: 'beginner',
    description: 'Humming Bee Breath — a soothing practice using a gentle humming sound to calm anxiety and induce meditative stillness.',
    duration: '8 min',
    benefits: 'Reduces anxiety and anger,Improves sleep quality,Lowers blood pressure,Calms the mind for meditation,Relieves tension in head and neck',
    image: '',
  },
  {
    name: 'Ujjayi',
    sanskrit: 'Ujjāyī',
    category: 'pranayama',
    difficulty: 'intermediate',
    description: 'Victorious Breath — a deep, oceanic breathing technique with a gentle throat constriction that builds internal heat and focus.',
    duration: '10 min',
    benefits: 'Builds internal heat in the body,Improves concentration and focus,Regulates blood pressure,Strengthens vocal cords,Enhances endurance during practice',
    image: '',
  },
  {
    name: 'Surya Namaskar Flow',
    sanskrit: 'Sūrya Namaskāra Vinyāsa',
    category: 'exercise',
    difficulty: 'advanced',
    description: 'An intensified dynamic flow of Sun Salutations performed at a vigorous pace — a complete Indian bodyweight workout.',
    duration: '25 min',
    benefits: 'Full-body cardiovascular workout,Builds muscular endurance,Burns calories efficiently,Increases flexibility and agility,Builds mental resilience and discipline',
    image: '',
  },
  {
    name: 'Danda Bethak',
    sanskrit: 'Daṇḍa Bait\'hak',
    category: 'exercise',
    difficulty: 'advanced',
    description: 'Traditional Indian push-up and squat combination — the ancient wrestler\'s conditioning exercise that builds raw functional strength.',
    duration: '15 min',
    benefits: 'Builds upper body and core strength,Develops explosive power,Improves joint mobility,Enhances cardiovascular endurance,Builds functional full-body strength',
    image: '',
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where: Record<string, unknown> = {};

    if (category) {
      where.category = category;
    }

    let poses = await db.yogaPose.findMany({ where });

    // If no poses exist in DB, return seed data
    if (poses.length === 0) {
      poses = defaultPoses.map((p, i) => ({
        id: `seed-${i + 1}`,
        ...p,
      })) as Awaited<ReturnType<typeof db.yogaPose.findMany>>;
    }

    return NextResponse.json(poses);
  } catch (error) {
    console.error('Error fetching yoga poses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch yoga poses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const bodyText = await request.text();
    const body = bodyText ? JSON.parse(bodyText) : {};

    // If specific pose data provided, create it
    if (body.name) {
      const pose = await db.yogaPose.create({
        data: {
          name: body.name,
          sanskrit: body.sanskrit ?? '',
          category: body.category ?? 'yoga',
          difficulty: body.difficulty ?? 'beginner',
          description: body.description ?? '',
          duration: body.duration ?? '5 min',
          benefits: body.benefits ?? '',
          image: body.image ?? '',
        },
      });
      return NextResponse.json(pose, { status: 201 });
    }

    // Otherwise, seed the default poses
    const existingCount = await db.yogaPose.count();

    if (existingCount > 0) {
      return NextResponse.json({
        message: 'Yoga poses already seeded',
        count: existingCount,
      });
    }

    const created = await db.yogaPose.createMany({
      data: defaultPoses,
    });

    return NextResponse.json({
      message: 'Yoga poses seeded successfully',
      count: created.count,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating yoga poses:', error);
    return NextResponse.json(
      { error: 'Failed to create yoga poses' },
      { status: 500 }
    );
  }
}
