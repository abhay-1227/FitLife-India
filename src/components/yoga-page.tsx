'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock,
  Flame,
  Wind,
  Activity,
  TreePine,
  Sun,
  Flower2,
  Heart,
  Eye,
  Shield,
  Brain,
  Sparkles,
  X,
  ChevronRight,
  Zap,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

type Category = 'all' | 'yoga' | 'pranayama' | 'exercise'
type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'all'

interface YogaPose {
  id: string
  name: string
  sanskrit: string
  category: 'yoga' | 'pranayama' | 'exercise'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  description: string
  duration: string
  benefits: string[]
  image: string
  popular?: boolean
  calorieBurn?: string
  poseCount?: number
}

const categoryLabels: Record<Category, string> = {
  all: 'All',
  yoga: 'Yoga Asanas',
  pranayama: 'Pranayama',
  exercise: 'Indian Exercises',
}

const difficultyConfig: Record<string, { label: string; badgeClass: string; gradientFrom: string; gradientTo: string }> = {
  beginner: {
    label: 'Beginner',
    badgeClass: 'bg-teal-500/80 text-background',
    gradientFrom: 'from-teal-500/20',
    gradientTo: 'to-teal-600/5',
  },
  intermediate: {
    label: 'Intermediate',
    badgeClass: 'bg-amber-400/80 text-background',
    gradientFrom: 'from-amber-400/20',
    gradientTo: 'to-amber-500/5',
  },
  advanced: {
    label: 'Advanced',
    badgeClass: 'bg-orange-500/80 text-white',
    gradientFrom: 'from-orange-500/20',
    gradientTo: 'to-orange-600/5',
  },
}

const difficultyFilterLabels: Record<Difficulty, string> = {
  all: 'All Levels',
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

const categoryIcon: Record<string, React.ReactNode> = {
  yoga: <TreePine className="size-3.5" />,
  pranayama: <Wind className="size-3.5" />,
  exercise: <Activity className="size-3.5" />,
}

const yogaPoses: YogaPose[] = [
  {
    id: '1',
    name: 'Surya Namaskar',
    sanskrit: 'Sūrya Namaskāra',
    category: 'yoga',
    difficulty: 'beginner',
    description: 'A flowing sequence of 12 linked asanas that form a complete warm-up and cardiovascular workout, honoring the sun.',
    duration: '15 min',
    benefits: ['Improves cardiovascular health', 'Enhances flexibility of the entire body', 'Stimulates digestive system', 'Boosts energy and vitality', 'Tones muscles and joints'],
    image: '',
    popular: true,
    calorieBurn: '120-150 kcal',
    poseCount: 12,
  },
  {
    id: '2',
    name: 'Padmasana',
    sanskrit: 'Padmāsana',
    category: 'yoga',
    difficulty: 'beginner',
    description: 'The classic cross-legged meditation posture that calms the mind and opens the hips for deep contemplation.',
    duration: '10 min',
    benefits: ['Calms the mind and reduces stress', 'Opens hips and stretches ankles', 'Improves posture and spinal alignment', 'Stimulates digestion', 'Prepares body for meditation'],
    image: '',
    calorieBurn: '15-25 kcal',
  },
  {
    id: '3',
    name: 'Vrikshasana',
    sanskrit: 'Vṛkṣāsana',
    category: 'yoga',
    difficulty: 'intermediate',
    description: 'The Tree Pose cultivates balance, focus, and grounding energy — standing tall like a steadfast tree.',
    duration: '5 min',
    benefits: ['Improves balance and stability', 'Strengthens legs and core', 'Opens hips and stretches groins', 'Enhances concentration', 'Builds mental fortitude'],
    image: '',
    calorieBurn: '20-30 kcal',
  },
  {
    id: '4',
    name: 'Bhujangasana',
    sanskrit: 'Bhujaṅgāsana',
    category: 'yoga',
    difficulty: 'beginner',
    description: 'Cobra Pose opens the chest, strengthens the spine, and mimics the raised hood of a cobra — a powerful heart opener.',
    duration: '5 min',
    benefits: ['Strengthens spine and back muscles', 'Opens chest and lungs', 'Stimulates abdominal organs', 'Relieves stress and fatigue', 'Improves posture'],
    image: '',
    calorieBurn: '25-35 kcal',
  },
  {
    id: '5',
    name: 'Tadasana',
    sanskrit: 'Tāḍāsana',
    category: 'yoga',
    difficulty: 'beginner',
    description: 'Mountain Pose — the foundation of all standing poses. Teaches correct posture and conscious breathing.',
    duration: '5 min',
    benefits: ['Improves posture and alignment', 'Strengthens thighs and ankles', 'Increases body awareness', 'Calms the nervous system', 'Improves circulation'],
    image: '',
    calorieBurn: '10-15 kcal',
  },
  {
    id: '6',
    name: 'Trikonasana',
    sanskrit: 'Trikonāsana',
    category: 'yoga',
    difficulty: 'intermediate',
    description: 'Triangle Pose stretches the entire side body, strengthens legs, and improves balance through geometric alignment.',
    duration: '5 min',
    benefits: ['Stretches hips, groins, and hamstrings', 'Strengthens legs and core', 'Stimulates abdominal organs', 'Improves balance and stability', 'Relieves back pain'],
    image: '',
    calorieBurn: '25-35 kcal',
  },
  {
    id: '7',
    name: 'Anulom Vilom',
    sanskrit: 'Anuloma Viloma',
    category: 'pranayama',
    difficulty: 'beginner',
    description: 'Alternate Nostril Breathing — the cornerstone pranayama technique that balances the left and right energy channels.',
    duration: '10 min',
    benefits: ['Balances left and right brain hemispheres', 'Calms the nervous system', 'Improves respiratory function', 'Reduces anxiety and stress', 'Enhances concentration'],
    image: '',
    calorieBurn: '15-20 kcal',
  },
  {
    id: '8',
    name: 'Kapalbhati',
    sanskrit: 'Kapālabhāti',
    category: 'pranayama',
    difficulty: 'intermediate',
    description: 'Skull Shining Breath — a powerful cleansing technique with rapid exhalations that energize the body and clear the mind.',
    duration: '10 min',
    benefits: ['Cleanses respiratory passages', 'Energizes the nervous system', 'Improves digestion and metabolism', 'Strengthens abdominal muscles', 'Clears mental fog'],
    image: '',
    popular: true,
    calorieBurn: '40-60 kcal',
  },
  {
    id: '9',
    name: 'Bhramari',
    sanskrit: 'Bhramarī',
    category: 'pranayama',
    difficulty: 'beginner',
    description: 'Humming Bee Breath — a soothing practice using a gentle humming sound to calm anxiety and induce meditative stillness.',
    duration: '8 min',
    benefits: ['Reduces anxiety and anger', 'Improves sleep quality', 'Lowers blood pressure', 'Calms the mind for meditation', 'Relieves tension in head and neck'],
    image: '',
    calorieBurn: '10-15 kcal',
  },
  {
    id: '10',
    name: 'Ujjayi',
    sanskrit: 'Ujjāyī',
    category: 'pranayama',
    difficulty: 'intermediate',
    description: 'Victorious Breath — a deep, oceanic breathing technique with a gentle throat constriction that builds internal heat and focus.',
    duration: '10 min',
    benefits: ['Builds internal heat in the body', 'Improves concentration and focus', 'Regulates blood pressure', 'Strengthens vocal cords', 'Enhances endurance during practice'],
    image: '',
    calorieBurn: '20-30 kcal',
  },
  {
    id: '11',
    name: 'Surya Namaskar Flow',
    sanskrit: 'Sūrya Namaskāra Vinyāsa',
    category: 'exercise',
    difficulty: 'advanced',
    description: 'An intensified dynamic flow of Sun Salutations performed at a vigorous pace — a complete Indian bodyweight workout.',
    duration: '25 min',
    benefits: ['Full-body cardiovascular workout', 'Builds muscular endurance', 'Burns calories efficiently', 'Increases flexibility and agility', 'Builds mental resilience and discipline'],
    image: '',
    calorieBurn: '200-280 kcal',
    poseCount: 24,
  },
  {
    id: '12',
    name: 'Danda Bethak',
    sanskrit: "Daṇḍa Bait'hak",
    category: 'exercise',
    difficulty: 'advanced',
    description: 'Traditional Indian push-up and squat combination — the ancient wrestler\'s conditioning exercise that builds raw functional strength.',
    duration: '15 min',
    benefits: ['Builds upper body and core strength', 'Develops explosive power', 'Improves joint mobility', 'Enhances cardiovascular endurance', 'Builds functional full-body strength'],
    image: '',
    calorieBurn: '150-200 kcal',
  },
]

const benefitIcons = [
  <Heart key="h" className="size-4 text-teal-400 shrink-0" />,
  <Shield key="s" className="size-4 text-teal-400 shrink-0" />,
  <Brain key="b" className="size-4 text-teal-400 shrink-0" />,
  <Sparkles key="sp" className="size-4 text-teal-400 shrink-0" />,
  <Eye key="e" className="size-4 text-teal-400 shrink-0" />,
]

// ─── Mandala SVG Component ───────────────────────────────────────────────────

function MandalaPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04]">
      {/* Outer ring */}
      <div className="mandala-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
        <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          {Array.from({ length: 12 }, (_, i) => (
            <g key={i} transform={`rotate(${i * 30} 300 300)`}>
              <ellipse cx="300" cy="100" rx="20" ry="60" stroke="oklch(0.828 0.189 84.429)" strokeWidth="1" fill="none" />
            </g>
          ))}
          <circle cx="300" cy="300" r="180" stroke="oklch(0.696 0.17 162.48)" strokeWidth="1" fill="none" />
          <circle cx="300" cy="300" r="120" stroke="oklch(0.828 0.189 84.429)" strokeWidth="1" fill="none" />
        </svg>
      </div>
      {/* Inner ring - reverse */}
      <div className="mandala-spin-reverse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px]">
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          {Array.from({ length: 8 }, (_, i) => (
            <g key={i} transform={`rotate(${i * 45} 200 200)`}>
              <path d="M200 80 L220 200 L200 180 L180 200 Z" stroke="oklch(0.705 0.213 47)" strokeWidth="1" fill="none" />
            </g>
          ))}
          <circle cx="200" cy="200" r="60" stroke="oklch(0.696 0.17 162.48)" strokeWidth="1" fill="none" />
        </svg>
      </div>
    </div>
  )
}

export default function YogaPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty>('all')
  const [selectedPose, setSelectedPose] = useState<YogaPose | null>(null)

  const categories: Category[] = ['all', 'yoga', 'pranayama', 'exercise']
  const difficulties: Difficulty[] = ['all', 'beginner', 'intermediate', 'advanced']

  const filteredPoses = yogaPoses.filter((pose) => {
    const catMatch = activeCategory === 'all' || pose.category === activeCategory
    const diffMatch = activeDifficulty === 'all' || pose.difficulty === activeDifficulty
    return catMatch && diffMatch
  })

  return (
    <div className="bg-transparent min-h-screen">
      {/* Hero Area */}
      <section className="pt-24 pb-12 relative overflow-hidden">
        {/* Animated Mandala Background */}
        <MandalaPattern />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <p className="text-lg sm:text-xl text-muted-foreground mb-3 tracking-wide">
              Discover
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="gradient-text-animated">
                Indian Yoga &amp; Exercise
              </span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Explore ancient Indian wellness practices — from grounding asanas and
              powerful pranayama techniques to traditional bodyweight exercises that
              build strength, flexibility, and inner peace.
            </p>
            {/* Pose count summary */}
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TreePine className="w-4 h-4 text-teal-400" />
                <span>6 Asanas</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wind className="w-4 h-4 text-amber-400" />
                <span>4 Pranayama</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="w-4 h-4 text-orange-400" />
                <span>2 Exercises</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs + Difficulty Filter */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center gap-4"
          >
            {/* Category tabs */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => {
                const isActive = activeCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`
                      border rounded-full px-5 py-2 text-sm font-medium
                      transition-all duration-300 cursor-pointer
                      ${
                        isActive
                          ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-background border-teal-500 shadow-lg shadow-teal-500/20'
                          : 'border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20'
                      }
                    `}
                  >
                    <span className="flex items-center gap-2">
                      {cat !== 'all' && categoryIcon[cat]}
                      {categoryLabels[cat]}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Difficulty filter */}
            <div className="flex flex-wrap justify-center gap-2">
              {difficulties.map((diff) => {
                const isActive = activeDifficulty === diff
                return (
                  <button
                    key={diff}
                    onClick={() => setActiveDifficulty(diff)}
                    className={`
                      rounded-full px-3.5 py-1 text-xs font-medium
                      transition-all duration-200 cursor-pointer border
                      ${
                        isActive
                          ? 'bg-white/10 border-white/20 text-foreground'
                          : 'border-transparent text-muted-foreground/60 hover:text-muted-foreground hover:bg-white/5'
                      }
                    `}
                  >
                    {difficultyFilterLabels[diff]}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Yoga Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            layout
            className="grid gap-6"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            }}
          >
            <AnimatePresence mode="popLayout">
              {filteredPoses.map((pose, index) => {
                const diffConfig = difficultyConfig[pose.difficulty]
                return (
                  <motion.div
                    key={pose.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.05,
                      layout: { duration: 0.3 },
                    }}
                  >
                    <div
                      onClick={() => setSelectedPose(pose)}
                      className="glass-card overflow-hidden cursor-pointer group"
                    >
                      {/* Image Area with Gradient Placeholder */}
                      <div
                        className={`
                          relative h-[200px] bg-gradient-to-br ${diffConfig.gradientFrom} ${diffConfig.gradientTo}
                          flex items-center justify-center overflow-hidden
                        `}
                      >
                        {/* Decorative pattern overlay */}
                        <div className="absolute inset-0 opacity-30">
                          <div className="absolute top-6 left-6 size-16 rounded-full border border-white/10" />
                          <div className="absolute bottom-8 right-8 size-24 rounded-full border border-white/5" />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <Flower2 className="size-16 text-white/10 group-hover:text-white/20 transition-colors duration-500" />
                          </div>
                        </div>

                        {/* Category icon center */}
                        <div className="relative z-10 flex flex-col items-center gap-2">
                          <div className="size-14 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all duration-500">
                            {categoryIcon[pose.category] &&
                              <span className="[&_svg]:size-7 [&_svg]:text-white/40 group-hover:[&_svg]:text-white/60 transition-colors duration-500">
                                {categoryIcon[pose.category]}
                              </span>
                            }
                          </div>
                          <span className="text-xs text-white/30 font-medium tracking-wider uppercase">
                            {categoryLabels[pose.category]}
                          </span>
                        </div>

                        {/* Difficulty Badge */}
                        <Badge
                          className={`absolute top-4 right-4 ${diffConfig.badgeClass} text-xs font-semibold border-0`}
                        >
                          {diffConfig.label}
                        </Badge>

                        {/* Popular Badge */}
                        {pose.popular && (
                          <Badge
                            className="absolute top-4 left-4 popular-badge text-xs font-bold text-background border-0"
                          >
                            ★ Popular
                          </Badge>
                        )}

                        {/* Shimmer on hover */}
                        <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      </div>

                      {/* Content Area */}
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-teal-300 transition-colors duration-300">
                              {pose.name}
                            </h3>
                            <p className="text-sm text-teal-400/80 font-medium mt-0.5">
                              {pose.sanskrit}
                            </p>
                          </div>
                          {pose.poseCount && (
                            <Badge className="bg-white/5 text-muted-foreground border border-white/10 text-[10px] shrink-0">
                              {pose.poseCount} poses
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                          {pose.description}
                        </p>
                        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/5">
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="size-3.5 text-teal-400/60" />
                            {pose.duration}
                          </span>
                          {pose.calorieBurn && (
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Flame className="size-3.5 text-orange-400/60" />
                              {pose.calorieBurn}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            {categoryIcon[pose.category]}
                            {categoryLabels[pose.category]}
                          </span>
                          <ChevronRight className="size-4 text-muted-foreground/40 ml-auto group-hover:text-teal-400 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>

          {/* Empty state */}
          {filteredPoses.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Flower2 className="size-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No poses found for this combination.</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Try adjusting the category or difficulty filters.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Pose Detail Dialog */}
      <Dialog
        open={!!selectedPose}
        onOpenChange={(open) => {
          if (!open) setSelectedPose(null)
        }}
      >
        <DialogContent className="glass-strong max-w-lg sm:max-w-xl p-0 overflow-hidden">
          {selectedPose && (() => {
            const diffConfig = difficultyConfig[selectedPose.difficulty]
            return (
              <>
                {/* Dialog Header with Gradient */}
                <div
                  className={`
                    relative h-48 bg-gradient-to-br ${diffConfig.gradientFrom} ${diffConfig.gradientTo}
                    flex items-center justify-center
                  `}
                >
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 left-4 size-20 rounded-full border border-white/10" />
                    <div className="absolute bottom-6 right-6 size-28 rounded-full border border-white/5" />
                  </div>
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="size-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center">
                      {categoryIcon[selectedPose.category] &&
                        <span className="[&_svg]:size-8 [&_svg]:text-white/50">
                          {categoryIcon[selectedPose.category]}
                        </span>
                      }
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${diffConfig.badgeClass} text-xs font-semibold border-0`}>
                        {diffConfig.label}
                      </Badge>
                      {selectedPose.popular && (
                        <Badge className="popular-badge text-xs font-bold text-background border-0">
                          ★ Popular
                        </Badge>
                      )}
                    </div>
                  </div>
                  {/* Close button overlay */}
                  <button
                    onClick={() => setSelectedPose(null)}
                    className="absolute top-3 right-3 size-8 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/50 transition-all z-20"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <ScrollArea className="max-h-[60vh]">
                  <div className="p-6 pt-4">
                    <DialogHeader className="mb-4">
                      <DialogTitle className="text-2xl font-bold">
                        {selectedPose.name}
                      </DialogTitle>
                      <DialogDescription className="sr-only">
                        Detailed information about {selectedPose.name}
                      </DialogDescription>
                      <p className="text-teal-400/80 font-medium text-sm">
                        {selectedPose.sanskrit}
                      </p>
                    </DialogHeader>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-3 mb-5">
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground bg-white/5 rounded-lg px-3 py-1.5">
                        <Clock className="size-3.5 text-teal-400/60" />
                        {selectedPose.duration}
                      </span>
                      {selectedPose.calorieBurn && (
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground bg-white/5 rounded-lg px-3 py-1.5">
                          <Flame className="size-3.5 text-orange-400/60" />
                          ~{selectedPose.calorieBurn}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground bg-white/5 rounded-lg px-3 py-1.5">
                        {categoryIcon[selectedPose.category]}
                        {categoryLabels[selectedPose.category]}
                      </span>
                      {selectedPose.poseCount && (
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground bg-white/5 rounded-lg px-3 py-1.5">
                          <Zap className="size-3.5 text-amber-400/60" />
                          {selectedPose.poseCount} poses
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Sun className="size-4 text-amber-400" />
                        About This Pose
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedPose.description}
                      </p>
                    </div>

                    {/* Benefits */}
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Sparkles className="size-4 text-teal-400" />
                        Benefits
                      </h4>
                      <div className="space-y-2.5">
                        {selectedPose.benefits.map((benefit, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06, duration: 0.3 }}
                            className="flex items-start gap-3 text-sm"
                          >
                            {benefitIcons[i % benefitIcons.length]}
                            <span className="text-muted-foreground leading-relaxed">
                              {benefit}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
