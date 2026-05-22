'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wind,
  Flame,
  TreePine,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Leaf,
  Sun,
  Moon,
  Heart,
  Utensils,
  Dumbbell,
  Coffee,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// ─── Dosha Types ──────────────────────────────────────────────────────────────

type Dosha = 'vata' | 'pitta' | 'kapha'

interface DoshaInfo {
  name: string
  element: string
  color: string
  gradientFrom: string
  gradientTo: string
  bgTint: string
  borderTint: string
  description: string
  characteristics: string[]
  foods: { favor: string[]; avoid: string[] }
  yoga: string[]
  lifestyle: string[]
}

const DOSHA_INFO: Record<Dosha, DoshaInfo> = {
  vata: {
    name: 'Vata',
    element: 'Air + Space',
    color: 'text-blue-300',
    gradientFrom: 'from-blue-400/20',
    gradientTo: 'to-indigo-500/5',
    bgTint: 'bg-blue-500/5',
    borderTint: 'border-blue-500/15',
    description:
      'Vata is the energy of movement and creativity. Vata-dominant individuals are quick-thinking, adaptable, and energetic. When imbalanced, they may experience anxiety, dryness, and restlessness.',
    characteristics: [
      'Slim build with light frame',
      'Quick mind, creative thinker',
      'Irregular appetite and digestion',
      'Dry skin and hair',
      'Loves warmth and hates cold',
      'Light sleeper, tendency to worry',
    ],
    foods: {
      favor: [
        'Warm foods — khichdi, dal with ghee, warm milk',
        'Sweet fruits — bananas, mangoes, dates',
        'Cooked vegetables — sweet potato, pumpkin, beets',
        'Warming spices — ginger, cinnamon, cardamom',
        'Nuts and seeds — almonds, sesame, cashews',
      ],
      avoid: [
        'Raw salads and cold foods',
        'Bitter and astringent tastes',
        'Dry crackers and chips',
        'Cold drinks and ice cream',
        'Excessive caffeine',
      ],
    },
    yoga: [
      'Padmasana (Lotus Pose) — grounding and calming',
      'Bhujangasana (Cobra Pose) — strengthens spine',
      'Tadasana (Mountain Pose) — builds stability',
      'Anulom Vilom — balances the nervous system',
      'Yoga Nidra — deep relaxation practice',
    ],
    lifestyle: [
      'Maintain a regular daily routine (dinacharya)',
      'Self-massage (Abhyanga) with warm sesame oil',
      'Go to bed before 10 PM for restful sleep',
      'Avoid excessive travel and overstimulation',
      'Practice calming activities like meditation and gardening',
    ],
  },
  pitta: {
    name: 'Pitta',
    element: 'Fire + Water',
    color: 'text-orange-300',
    gradientFrom: 'from-orange-400/20',
    gradientTo: 'to-red-500/5',
    bgTint: 'bg-orange-500/5',
    borderTint: 'border-orange-500/15',
    description:
      'Pitta is the energy of transformation and metabolism. Pitta-dominant individuals are sharp, focused, and ambitious. When imbalanced, they may experience anger, inflammation, and digestive issues.',
    characteristics: [
      'Medium, athletic build',
      'Strong intellect and leadership qualities',
      'Strong appetite and good digestion',
      'Warm body temperature, sensitive to heat',
      'Fair or reddish skin, prone to rashes',
      'Perfectionist nature, competitive drive',
    ],
    foods: {
      favor: [
        'Cooling foods — cucumber, coconut water, mint chutney',
        'Sweet fruits — melons, grapes, pomegranates',
        'Dairy — milk, ghee, fresh paneer, lassi',
        'Bitter greens — methi, palak, karela',
        'Basmati rice and wheat products',
      ],
      avoid: [
        'Spicy food — chillies, black pepper',
        'Sour foods — vinegar, tamarind, fermented foods',
        'Excessive salt and oily fried food',
        'Alcohol and fermented drinks',
        'Overripe or sour fruits',
      ],
    },
    yoga: [
      'Sheetali Pranayama — cooling breath technique',
      'Vrikshasana (Tree Pose) — cultivates patience',
      'Bhujangasana (Cobra Pose) — gentle backbend',
      'Shavasana (Corpse Pose) — deep relaxation',
      'Moon Salutation (Chandra Namaskar) — cooling flow',
    ],
    lifestyle: [
      'Avoid excessive sun and heat exposure',
      'Practice cooling pranayama and meditation',
      'Apply coconut oil for Abhyanga (self-massage)',
      'Take walks in nature, especially near water',
      'Practice patience and compassion in daily interactions',
    ],
  },
  kapha: {
    name: 'Kapha',
    element: 'Earth + Water',
    color: 'text-emerald-300',
    gradientFrom: 'from-emerald-400/20',
    gradientTo: 'to-green-500/5',
    bgTint: 'bg-emerald-500/5',
    borderTint: 'border-emerald-500/15',
    description:
      'Kapha is the energy of structure and stability. Kapha-dominant individuals are calm, loving, and grounded. When imbalanced, they may experience lethargy, weight gain, and congestion.',
    characteristics: [
      'Sturdy, well-built frame',
      'Calm and composed personality',
      'Strong immunity and endurance',
      'Oily skin and thick hair',
      'Slow but steady digestion',
      'Deep sleeper, tendency to oversleep',
    ],
    foods: {
      favor: [
        'Light, warm foods — steamed vegetables, clear soups',
        'Spicy foods — black pepper, ginger, mustard seeds',
        'Bitter and astringent — honey, turmeric, green tea',
        'Barley, millet, and corn-based rotis',
        'Light fruits — apples, pears, berries, pomegranates',
      ],
      avoid: [
        'Heavy, oily, and fried foods',
        'Excessive sweets and dairy',
        'Cold drinks and ice cream',
        'Wheat and rice in excess',
        'Sleeping after meals',
      ],
    },
    yoga: [
      'Surya Namaskar (Sun Salutation) — energizing flow',
      'Kapalbhati Pranayama — stimulates metabolism',
      'Trikonasana (Triangle Pose) — activates core',
      'Dhanurasana (Bow Pose) — opens chest and lungs',
      'Bhastrika Pranayama — energizing breath',
    ],
    lifestyle: [
      'Wake up early — before 6 AM (Brahma Muhurta)',
      'Exercise vigorously every day',
      'Dry massage (Udvartana) with herbal powders',
      'Avoid daytime napping',
      'Seek new experiences and challenges to stay motivated',
    ],
  },
}

// ─── Quiz Questions ───────────────────────────────────────────────────────────

interface QuizOption {
  text: string
  dosha: Dosha
}

interface QuizQuestion {
  question: string
  options: QuizOption[]
}

const QUESTIONS: QuizQuestion[] = [
  {
    question: 'What is your body type?',
    options: [
      { text: 'Thin and light, hard to gain weight', dosha: 'vata' },
      { text: 'Medium build, muscular and athletic', dosha: 'pitta' },
      { text: 'Sturdy and well-built, gains weight easily', dosha: 'kapha' },
    ],
  },
  {
    question: 'How is your skin typically?',
    options: [
      { text: 'Dry, rough, or cool to touch', dosha: 'vata' },
      { text: 'Warm, oily, prone to redness or rashes', dosha: 'pitta' },
      { text: 'Smooth, thick, and moist', dosha: 'kapha' },
    ],
  },
  {
    question: 'How would you describe your appetite?',
    options: [
      { text: 'Irregular — sometimes hungry, sometimes not', dosha: 'vata' },
      { text: 'Strong — I get irritable if I miss a meal', dosha: 'pitta' },
      { text: 'Steady but slow — I can skip meals easily', dosha: 'kapha' },
    ],
  },
  {
    question: 'How do you sleep?',
    options: [
      { text: 'Light sleeper, often wake up at night', dosha: 'vata' },
      { text: 'Moderate sleeper, wake up refreshed', dosha: 'pitta' },
      { text: 'Deep and long sleeper, hard to wake up', dosha: 'kapha' },
    ],
  },
  {
    question: 'What is your mental nature?',
    options: [
      { text: 'Quick-thinking, creative, restless mind', dosha: 'vata' },
      { text: 'Focused, sharp, competitive, determined', dosha: 'pitta' },
      { text: 'Calm, steady, patient, contemplative', dosha: 'kapha' },
    ],
  },
  {
    question: 'How do you handle stress?',
    options: [
      { text: 'I become anxious and worried', dosha: 'vata' },
      { text: 'I become irritable and frustrated', dosha: 'pitta' },
      { text: 'I withdraw and become lethargic', dosha: 'kapha' },
    ],
  },
  {
    question: 'What weather do you prefer?',
    options: [
      { text: 'Warm and humid — I dislike cold and wind', dosha: 'vata' },
      { text: 'Cool and well-ventilated — I dislike heat', dosha: 'pitta' },
      { text: 'Warm and dry — I dislike cold and dampness', dosha: 'kapha' },
    ],
  },
  {
    question: 'What type of exercise do you enjoy most?',
    options: [
      { text: 'Light, varied activities — walking, dance, yoga', dosha: 'vata' },
      { text: 'Competitive and intense — running, sports, HIIT', dosha: 'pitta' },
      { text: 'Steady endurance — swimming, long walks, hiking', dosha: 'kapha' },
    ],
  },
  {
    question: 'What is your digestion like?',
    options: [
      { text: 'Irregular — sometimes good, sometimes bloated', dosha: 'vata' },
      { text: 'Strong — can digest almost anything, prone to acidity', dosha: 'pitta' },
      { text: 'Slow — feel heavy after meals', dosha: 'kapha' },
    ],
  },
  {
    question: 'How do you approach new projects?',
    options: [
      { text: 'Enthusiastic start, but lose interest quickly', dosha: 'vata' },
      { text: 'Goal-oriented, push through to completion', dosha: 'pitta' },
      { text: 'Slow to start, but steady and persistent', dosha: 'kapha' },
    ],
  },
]

// ─── Animation Variants ───────────────────────────────────────────────────────

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
}

// ─── Component ────────────────────────────────────────────────────────────────

type Screen = 'welcome' | 'quiz' | 'results'

export default function DoshaQuiz() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Dosha[]>([])
  const [direction, setDirection] = useState(1)

  const dominantDosha = useMemo<Dosha>(() => {
    const counts: Record<Dosha, number> = { vata: 0, pitta: 0, kapha: 0 }
    answers.forEach((d) => counts[d]++)
    const sorted = (Object.entries(counts) as [Dosha, number][]).sort((a, b) => b[1] - a[1])
    return sorted[0][0]
  }, [answers])

  const dosha = DOSHA_INFO[dominantDosha]

  const handleAnswer = (doshaType: Dosha) => {
    const newAnswers = [...answers, doshaType]
    setAnswers(newAnswers)
    if (currentQ < QUESTIONS.length - 1) {
      setDirection(1)
      setCurrentQ((q) => q + 1)
    } else {
      setScreen('results')
    }
  }

  const goBack = () => {
    if (currentQ > 0) {
      setDirection(-1)
      setCurrentQ((q) => q - 1)
      setAnswers((prev) => prev.slice(0, -1))
    }
  }

  const restart = () => {
    setScreen('welcome')
    setCurrentQ(0)
    setAnswers([])
    setDirection(1)
  }

  const progress = ((currentQ + (screen === 'results' ? 1 : 0)) / QUESTIONS.length) * 100

  // ─── Welcome Screen ──────────────────────────────────────────────────

  if (screen === 'welcome') {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-2"
        >
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-6 w-6 text-teal-400" />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-teal-400 via-orange-400 to-emerald-400 bg-clip-text text-transparent">
                Dosha Quiz
              </span>
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Discover your Ayurvedic constitution and personalized wellness guide
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-6 sm:p-8"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-teal-500/20 to-amber-500/20 border border-white/10 flex items-center justify-center mb-4"
            >
              <Leaf className="h-10 w-10 text-teal-400" />
            </motion.div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Discover Your Prakriti
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              In Ayurveda, every person has a unique constitution (Prakriti) determined by the three doshas.
              Understanding your dominant dosha helps you make better dietary, exercise, and lifestyle choices.
            </p>
          </div>

          {/* Three Dosha Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {([
              { key: 'vata' as Dosha, icon: Wind, label: 'Vata', element: 'Air + Space', desc: 'Creative, quick, light', colorFrom: 'from-blue-400/10', colorTo: 'to-indigo-500/5', accent: 'text-blue-300', border: 'border-blue-500/10' },
              { key: 'pitta' as Dosha, icon: Flame, label: 'Pitta', element: 'Fire + Water', desc: 'Sharp, focused, warm', colorFrom: 'from-orange-400/10', colorTo: 'to-red-500/5', accent: 'text-orange-300', border: 'border-orange-500/10' },
              { key: 'kapha' as Dosha, icon: TreePine, label: 'Kapha', element: 'Earth + Water', desc: 'Steady, calm, strong', colorFrom: 'from-emerald-400/10', colorTo: 'to-green-500/5', accent: 'text-emerald-300', border: 'border-emerald-500/10' },
            ]).map((d, i) => (
              <motion.div
                key={d.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                className={`p-4 rounded-xl bg-gradient-to-br ${d.colorFrom} ${d.colorTo} border ${d.border} text-center`}
              >
                <d.icon className={`h-8 w-8 mx-auto mb-2 ${d.accent}`} />
                <h4 className={`font-bold text-sm ${d.accent}`}>{d.label}</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">{d.element}</p>
                <p className="text-xs text-muted-foreground mt-1">{d.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={() => setScreen('quiz')}
              size="lg"
              className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-background font-semibold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all border-0"
            >
              Start Quiz
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              10 questions · Takes about 2 minutes
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  // ─── Quiz Screen ─────────────────────────────────────────────────────

  if (screen === 'quiz') {
    const question = QUESTIONS[currentQ]
    return (
      <div className="space-y-6">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">
              Question {currentQ + 1} of {QUESTIONS.length}
            </span>
            <span className="text-xs text-teal-400 font-medium">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Question Card */}
        <div className="glass-card p-6 sm:p-8 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQ}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
                {question.question}
              </h3>

              <div className="space-y-3">
                {question.options.map((option, i) => {
                  const doshaAccent: Record<Dosha, string> = {
                    vata: 'hover:border-blue-400/30 hover:bg-blue-500/5',
                    pitta: 'hover:border-orange-400/30 hover:bg-orange-500/5',
                    kapha: 'hover:border-emerald-400/30 hover:bg-emerald-500/5',
                  }
                  const doshaIconColor: Record<Dosha, string> = {
                    vata: 'text-blue-300',
                    pitta: 'text-orange-300',
                    kapha: 'text-emerald-300',
                  }
                  const doshaIcons: Record<Dosha, React.ElementType> = {
                    vata: Wind,
                    pitta: Flame,
                    kapha: TreePine,
                  }
                  const Icon = doshaIcons[option.dosha]

                  return (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.3 }}
                      onClick={() => handleAnswer(option.dosha)}
                      className={`w-full text-left p-4 rounded-xl border border-white/10 bg-white/[0.03] transition-all duration-200 group ${doshaAccent[option.dosha]}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="shrink-0 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                          <Icon className={`h-5 w-5 ${doshaIconColor[option.dosha]}`} />
                        </div>
                        <span className="text-sm font-medium text-foreground/90 group-hover:text-foreground transition-colors">
                          {option.text}
                        </span>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/[0.06]">
            <Button
              onClick={goBack}
              disabled={currentQ === 0}
              variant="ghost"
              className="text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <span className="text-xs text-muted-foreground">
              {answers.length} answered
            </span>
          </div>
        </div>
      </div>
    )
  }

  // ─── Results Screen ──────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header with Restart */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-2"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-teal-400" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-teal-400 via-orange-400 to-emerald-400 bg-clip-text text-transparent">
              Your Dosha
            </span>
          </h2>
        </div>
        <Button
          onClick={restart}
          variant="outline"
          className="border-white/10 hover:border-teal-500/30 hover:bg-teal-500/10 hover:text-teal-400 transition-all"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Retake
        </Button>
      </motion.div>

      {/* Dominant Dosha Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`glass-card p-6 sm:p-8 bg-gradient-to-br ${dosha.gradientFrom} ${dosha.gradientTo}`}
      >
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Dosha Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
            className={`w-24 h-24 rounded-full ${dosha.bgTint} border ${dosha.borderTint} flex items-center justify-center shrink-0`}
          >
            {dominantDosha === 'vata' && <Wind className="h-12 w-12 text-blue-300" />}
            {dominantDosha === 'pitta' && <Flame className="h-12 w-12 text-orange-300" />}
            {dominantDosha === 'kapha' && <TreePine className="h-12 w-12 text-emerald-300" />}
          </motion.div>

          {/* Dosha Info */}
          <div className="text-center sm:text-left flex-1">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`text-3xl font-bold ${dosha.color} mb-1`}
            >
              {dosha.name}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-muted-foreground mb-3"
            >
              Element: {dosha.element}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-muted-foreground leading-relaxed"
            >
              {dosha.description}
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Characteristics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Heart className={`h-5 w-5 ${dosha.color}`} />
          <h3 className="text-lg font-semibold text-foreground">Characteristics</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {dosha.characteristics.map((char, i) => (
            <motion.div
              key={char}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05, duration: 0.3 }}
              className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.03]"
            >
              <span className={`shrink-0 w-5 h-5 rounded-full ${dosha.bgTint} flex items-center justify-center text-[10px] font-bold ${dosha.color}`}>
                ✓
              </span>
              <span className="text-sm text-muted-foreground">{char}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Foods & Yoga */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Foods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Utensils className={`h-5 w-5 ${dosha.color}`} />
            <h3 className="text-lg font-semibold text-foreground">Recommended Foods</h3>
          </div>

          {/* Favor */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="h-4 w-4 text-teal-400" />
              <span className="text-sm font-medium text-teal-400">Favor</span>
            </div>
            <div className="space-y-1.5">
              {dosha.foods.favor.map((food, i) => (
                <motion.div
                  key={food}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.04, duration: 0.2 }}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="text-teal-400 shrink-0">+</span>
                  {food}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Avoid */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Moon className="h-4 w-4 text-red-400" />
              <span className="text-sm font-medium text-red-400">Avoid</span>
            </div>
            <div className="space-y-1.5">
              {dosha.foods.avoid.map((food, i) => (
                <motion.div
                  key={food}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.04, duration: 0.2 }}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="text-red-400 shrink-0">−</span>
                  {food}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Yoga & Exercise */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Dumbbell className={`h-5 w-5 ${dosha.color}`} />
            <h3 className="text-lg font-semibold text-foreground">Yoga & Exercise</h3>
          </div>
          <div className="space-y-2">
            {dosha.yoga.map((pose, i) => (
              <motion.div
                key={pose}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.05, duration: 0.2 }}
                className="flex items-start gap-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]"
              >
                <span className={`shrink-0 w-6 h-6 rounded-full ${dosha.bgTint} flex items-center justify-center text-xs font-bold ${dosha.color}`}>
                  {i + 1}
                </span>
                <span className="text-sm text-muted-foreground leading-relaxed">{pose}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Lifestyle Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Coffee className={`h-5 w-5 ${dosha.color}`} />
          <h3 className="text-lg font-semibold text-foreground">Lifestyle Tips</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {dosha.lifestyle.map((tip, i) => (
            <motion.div
              key={tip}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.05, duration: 0.3 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
            >
              <Leaf className={`h-4 w-4 shrink-0 mt-0.5 ${dosha.color}`} />
              <span className="text-sm text-muted-foreground leading-relaxed">{tip}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
