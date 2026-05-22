import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const yogaPoses = [
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
    sanskrit: "Daṇḍa Bait'hak",
    category: 'exercise',
    difficulty: 'advanced',
    description: "Traditional Indian push-up and squat combination — the ancient wrestler's conditioning exercise that builds raw functional strength.",
    duration: '15 min',
    benefits: 'Builds upper body and core strength,Develops explosive power,Improves joint mobility,Enhances cardiovascular endurance,Builds functional full-body strength',
    image: '',
  },
];

export async function POST(request: NextRequest) {
  try {
    const bodyText = await request.text();
    const _body = bodyText ? JSON.parse(bodyText) : {};

    const today = new Date().toISOString().split('T')[0];
    const results = { yogaPoses: 0, nutritionGoal: 0, foodEntries: 0 };

    // Seed Yoga Poses
    const existingPoses = await db.yogaPose.count();
    if (existingPoses === 0) {
      const createdPoses = await db.yogaPose.createMany({
        data: yogaPoses,
      });
      results.yogaPoses = createdPoses.count;
    } else {
      results.yogaPoses = existingPoses;
    }

    // Seed Default Nutrition Goal for guest user
    const existingGoal = await db.nutritionGoal.findUnique({
      where: { userId: 'guest' },
    });
    if (!existingGoal) {
      await db.nutritionGoal.create({
        data: {
          userId: 'guest',
          calories: 2000,
          protein: 150,
          carbs: 250,
          fats: 65,
          fiber: 30,
          sugar: 50,
          sodium: 2300,
        },
      });
      results.nutritionGoal = 1;
    } else {
      results.nutritionGoal = 1;
    }

    // Seed Sample Food Entries for today
    const existingFoodToday = await db.foodEntry.count({
      where: { date: today, userId: 'guest' },
    });
    if (existingFoodToday === 0) {
      const foodEntries = await Promise.all([
        db.foodEntry.create({
          data: {
            name: '2 Roti',
            calories: 240,
            protein: 8,
            carbs: 44,
            fats: 4,
            fiber: 4,
            sugar: 1,
            sodium: 180,
            date: today,
            userId: 'guest',
          },
        }),
        db.foodEntry.create({
          data: {
            name: 'Dal Tadka',
            calories: 180,
            protein: 12,
            carbs: 22,
            fats: 6,
            fiber: 8,
            sugar: 3,
            sodium: 420,
            date: today,
            userId: 'guest',
          },
        }),
        db.foodEntry.create({
          data: {
            name: 'Curd Rice',
            calories: 220,
            protein: 8,
            carbs: 38,
            fats: 5,
            fiber: 1,
            sugar: 6,
            sodium: 350,
            date: today,
            userId: 'guest',
          },
        }),
        db.foodEntry.create({
          data: {
            name: 'Masala Chai',
            calories: 90,
            protein: 3,
            carbs: 12,
            fats: 3,
            fiber: 0,
            sugar: 10,
            sodium: 65,
            date: today,
            userId: 'guest',
          },
        }),
      ]);
      results.foodEntries = foodEntries.length;
    } else {
      results.foodEntries = existingFoodToday;
    }

    return NextResponse.json({
      message: 'Database seeded successfully',
      counts: results,
    }, { status: 201 });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
