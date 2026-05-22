'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Plus,
  X,
  Flame,
  Drumstick,
  Wheat,
  Droplets,
  Leaf,
  Candy,
  Waves,
  UtensilsCrossed,
  Clock,
  History,
  FlameKindling,
  Apple,
  Salad,
  Croissant,
  Trophy,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import NutritionChart from '@/components/nutrition-chart'

// ─── Types ───────────────────────────────────────────────────────────────────

interface FoodEntry {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  fiber: number
  sugar: number
  sodium: number
}

interface FoodDbItem {
  cal: number
  protein: number
  carbs: number
  fats: number
  fiber: number
  sugar: number
  sodium: number
  category: 'healthy' | 'moderate' | 'highcal'
  icon: React.ElementType
}

interface ChartData {
  date: string
  calories: number
  goal: number
}

// ─── Food Database ───────────────────────────────────────────────────────────

const FOOD_DB: Record<string, FoodDbItem> = {
  roti: { cal: 120, protein: 3.5, carbs: 20, fats: 3.7, fiber: 3.2, sugar: 1.0, sodium: 180, category: 'healthy', icon: Salad },
  chapati: { cal: 120, protein: 3.5, carbs: 20, fats: 3.7, fiber: 3.2, sugar: 1.0, sodium: 180, category: 'healthy', icon: Salad },
  rice: { cal: 206, protein: 4.3, carbs: 45, fats: 0.4, fiber: 0.6, sugar: 0.1, sodium: 2, category: 'moderate', icon: Croissant },
  dal: { cal: 170, protein: 9.0, carbs: 24, fats: 4.0, fiber: 5.0, sugar: 2.0, sodium: 320, category: 'healthy', icon: Apple },
  rajma: { cal: 210, protein: 11.0, carbs: 30, fats: 4.5, fiber: 8.0, sugar: 3.0, sodium: 280, category: 'healthy', icon: Apple },
  paneer: { cal: 265, protein: 18.3, carbs: 1.2, fats: 20.8, fiber: 0, sugar: 1.2, sodium: 420, category: 'moderate', icon: Drumstick },
  chicken: { cal: 239, protein: 27.0, carbs: 0, fats: 14.0, fiber: 0, sugar: 0, sodium: 350, category: 'moderate', icon: Drumstick },
  egg: { cal: 155, protein: 13.0, carbs: 1.1, fats: 11.0, fiber: 0, sugar: 1.1, sodium: 170, category: 'healthy', icon: Apple },
  milk: { cal: 149, protein: 8.0, carbs: 12, fats: 8.0, fiber: 0, sugar: 12, sodium: 105, category: 'healthy', icon: Droplets },
  curd: { cal: 98, protein: 11.0, carbs: 3.4, fats: 4.3, fiber: 0, sugar: 3.4, sodium: 70, category: 'healthy', icon: Apple },
  sabzi: { cal: 130, protein: 4.0, carbs: 12, fats: 7.0, fiber: 3.5, sugar: 4.0, sodium: 350, category: 'healthy', icon: Salad },
  'dal makhani': { cal: 230, protein: 9.0, carbs: 25, fats: 11.0, fiber: 6.0, sugar: 3.0, sodium: 480, category: 'moderate', icon: Apple },
  'palak paneer': { cal: 260, protein: 14.0, carbs: 8.0, fats: 20.0, fiber: 3.5, sugar: 2.0, sodium: 520, category: 'moderate', icon: Salad },
  chole: { cal: 220, protein: 12.0, carbs: 28, fats: 7.0, fiber: 8.0, sugar: 4.0, sodium: 380, category: 'moderate', icon: Apple },
  samosa: { cal: 262, protein: 4.0, carbs: 24, fats: 17.0, fiber: 2.5, sugar: 1.5, sodium: 540, category: 'highcal', icon: Croissant },
  paratha: { cal: 200, protein: 5.0, carbs: 26, fats: 8.0, fiber: 3.0, sugar: 1.0, sodium: 320, category: 'moderate', icon: Croissant },
  idli: { cal: 130, protein: 3.0, carbs: 26, fats: 1.0, fiber: 1.5, sugar: 0.5, sodium: 250, category: 'healthy', icon: Salad },
  dosa: { cal: 168, protein: 4.0, carbs: 24, fats: 6.0, fiber: 1.5, sugar: 1.0, sodium: 290, category: 'moderate', icon: Croissant },
  biryani: { cal: 350, protein: 14.0, carbs: 40, fats: 13.0, fiber: 2.0, sugar: 2.0, sodium: 550, category: 'highcal', icon: Croissant },
  lassi: { cal: 160, protein: 6.0, carbs: 22, fats: 5.0, fiber: 0, sugar: 20, sodium: 90, category: 'moderate', icon: Droplets },
  chai: { cal: 95, protein: 3.0, carbs: 12, fats: 3.0, fiber: 0, sugar: 10, sodium: 65, category: 'healthy', icon: Droplets },
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CALORIE_GOAL = 2000
const PROTEIN_GOAL = 150
const CARBS_GOAL = 250
const FATS_GOAL = 65
const FIBER_GOAL = 30
const SUGAR_GOAL = 50
const SODIUM_GOAL = 2300
const RING_RADIUS = 80
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

// ─── Meal Parser ─────────────────────────────────────────────────────────────

function parseMealText(text: string): { name: string; qty: number; item: FoodDbItem }[] {
  const results: { name: string; qty: number; item: FoodDbItem }[] = []
  const parts = text.split(/[,;]/).map((s) => s.trim().toLowerCase()).filter(Boolean)

  for (const part of parts) {
    let qty = 1
    let foodName = ''

    // Pattern 1: "2 bowl of dal", "1 cup of rice"
    const p1 = /(\d+)\s*(bowl|cup|glass|plate|pieces?|slices?|servings?)?\s*of\s+([a-zA-Z\s]+)/i
    const m1 = part.match(p1)
    if (m1) {
      qty = parseInt(m1[1], 10) || 1
      foodName = m1[3].trim()
    } else {
      // Pattern 2: "2 roti", "1 egg"
      const p2 = /(\d+)\s+([a-zA-Z\s]+)/i
      const m2 = part.match(p2)
      if (m2) {
        qty = parseInt(m2[1], 10) || 1
        foodName = m2[2].trim()
      } else {
        // Pattern 3: just a food name
        foodName = part.trim()
      }
    }

    // Try exact match first, then partial
    const lookup = foodName.toLowerCase().trim()
    if (FOOD_DB[lookup]) {
      results.push({ name: lookup, qty, item: FOOD_DB[lookup] })
    } else {
      // Try partial match
      const match = Object.keys(FOOD_DB).find((k) => k.includes(lookup) || lookup.includes(k))
      if (match) {
        results.push({ name: match, qty, item: FOOD_DB[match] })
      }
    }
  }

  return results
}

// ─── Animation Variants ──────────────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const cardTransition = {
  duration: 0.5,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
}

// ─── Progress Bar Component ──────────────────────────────────────────────────

function GradientProgressBar({
  value,
  max,
  gradient,
  label,
  unit,
  icon: Icon,
}: {
  value: number
  max: number
  gradient: string
  label: string
  unit: string
  icon: React.ElementType
}) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-foreground/80">
          <Icon className="h-3.5 w-3.5" />
          <span className="font-medium">{label}</span>
        </div>
        <span className="text-muted-foreground text-xs">
          {Math.round(value)}
          {unit} / {max}
          {unit}
        </span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${gradient}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// ─── Helper: get today's date as YYYY-MM-DD ──────────────────────────────────

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

// ─── Generate sample chart data for last 7 days ─────────────────────────────

function generateSampleChartData(): ChartData[] {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const sampleCalories = [1850, 2100, 1720, 1960, 2250, 1680, 1930]
  const today = new Date()
  const data: ChartData[] = []

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dayIndex = d.getDay()
    data.push({
      date: dayNames[dayIndex],
      calories: sampleCalories[(6 - i) % sampleCalories.length],
      goal: CALORIE_GOAL,
    })
  }

  return data
}

// ─── Food Category Icon Helper ───────────────────────────────────────────────

function getFoodCategoryIcon(name: string): React.ElementType {
  const lower = name.toLowerCase()
  const match = Object.keys(FOOD_DB).find((k) => lower.includes(k) || k.includes(lower))
  if (match && FOOD_DB[match]) return FOOD_DB[match].icon
  return UtensilsCrossed
}

function getFoodCategory(name: string): 'healthy' | 'moderate' | 'highcal' {
  const lower = name.toLowerCase()
  const match = Object.keys(FOOD_DB).find((k) => lower.includes(k) || k.includes(lower))
  if (match && FOOD_DB[match]) return FOOD_DB[match].category
  // Fallback: estimate by calorie check in name
  if (lower.includes('samosa') || lower.includes('biryani') || lower.includes('fried')) return 'highcal'
  return 'moderate'
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function NutritionPage() {
  const [foodLog, setFoodLog] = useState<FoodEntry[]>([])
  const [aiInput, setAiInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [chartData, setChartData] = useState<ChartData[]>(generateSampleChartData())
  const [loading, setLoading] = useState(true)
  const [ringPulse, setRingPulse] = useState(false)

  // Form state
  const [formName, setFormName] = useState('')
  const [formCal, setFormCal] = useState('')
  const [formProtein, setFormProtein] = useState('')
  const [formCarbs, setFormCarbs] = useState('')
  const [formFats, setFormFats] = useState('')
  const [formFiber, setFormFiber] = useState('')
  const [formSugar, setFormSugar] = useState('')
  const [formSodium, setFormSodium] = useState('')

  // Simulated streak
  const streakDays = 5

  // Fetch food entries from database on mount
  useEffect(() => {
    const fetchFoodEntries = async () => {
      try {
        const today = getTodayDate()
        const res = await fetch(`/api/food?userId=guest&date=${today}`)
        if (res.ok) {
          const entries = await res.json()
          setFoodLog(entries)
        }
      } catch (err) {
        console.error('Failed to fetch food entries:', err)
      } finally {
        setLoading(false)
      }
    }

    const fetchChartData = async () => {
      try {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const today = new Date()
        const weekData: ChartData[] = []

        // Fetch last 7 days
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today)
          d.setDate(d.getDate() - i)
          const dateStr = d.toISOString().split('T')[0]
          const dayIndex = d.getDay()

          try {
            const res = await fetch(`/api/food?userId=guest&date=${dateStr}`)
            if (res.ok) {
              const entries: FoodEntry[] = await res.json()
              const totalCal = entries.reduce((sum, e) => sum + e.calories, 0)
              weekData.push({
                date: dayNames[dayIndex],
                calories: totalCal,
                goal: CALORIE_GOAL,
              })
            }
          } catch {
            weekData.push({
              date: dayNames[dayIndex],
              calories: 0,
              goal: CALORIE_GOAL,
            })
          }
        }

        // If all days have 0 calories (no real data), use sample data
        const hasRealData = weekData.some((d) => d.calories > 0)
        if (hasRealData) {
          setChartData(weekData)
        } else {
          setChartData(generateSampleChartData())
        }
      } catch (err) {
        console.error('Failed to fetch chart data:', err)
      }
    }

    fetchFoodEntries()
    fetchChartData()
  }, [])

  // Computed totals
  const totals = useMemo(() => {
    return foodLog.reduce(
      (acc, f) => ({
        calories: acc.calories + f.calories,
        protein: acc.protein + f.protein,
        carbs: acc.carbs + f.carbs,
        fats: acc.fats + f.fats,
        fiber: acc.fiber + f.fiber,
        sugar: acc.sugar + f.sugar,
        sodium: acc.sodium + f.sodium,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0, sodium: 0 }
    )
  }, [foodLog])

  const calorieProgress = Math.min((totals.calories / CALORIE_GOAL) * 100, 100)
  const calorieOffset = RING_CIRCUMFERENCE - (calorieProgress / 100) * RING_CIRCUMFERENCE

  // Nutrient Balance Score (0-100) based on how close macros are to goals
  const balanceScore = useMemo(() => {
    const proteinScore = Math.min(totals.protein / PROTEIN_GOAL, 1)
    const carbsScore = Math.min(totals.carbs / CARBS_GOAL, 1)
    const fatsScore = Math.min(totals.fats / FATS_GOAL, 1)
    const fiberScore = Math.min(totals.fiber / FIBER_GOAL, 1)
    // Penalize over-consumption
    const proteinOver = totals.protein > PROTEIN_GOAL ? 1 - (totals.protein - PROTEIN_GOAL) / PROTEIN_GOAL : 1
    const carbsOver = totals.carbs > CARBS_GOAL ? 1 - (totals.carbs - CARBS_GOAL) / CARBS_GOAL : 1
    const fatsOver = totals.fats > FATS_GOAL ? 1 - (totals.fats - FATS_GOAL) / FATS_GOAL : 1

    const raw = (proteinScore * proteinOver + carbsScore * carbsOver + fatsScore * fatsOver + fiberScore) / 4
    return Math.round(Math.max(0, Math.min(raw * 100, 100)))
  }, [totals])

  // Add food entry (persist to database)
  const addFood = useCallback(
    async (entry: Omit<FoodEntry, 'id'>) => {
      try {
        const today = getTodayDate()
        const res = await fetch('/api/food', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...entry,
            date: today,
            userId: 'guest',
          }),
        })

        if (res.ok) {
          const created = await res.json()
          setFoodLog((prev) => [created, ...prev])

          // Pulse ring on value change
          setRingPulse(true)
          setTimeout(() => setRingPulse(false), 600)

          // Update chart data for today
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
          const todayDayName = dayNames[new Date().getDay()]
          setChartData((prev) =>
            prev.map((d) =>
              d.date === todayDayName
                ? { ...d, calories: d.calories + entry.calories }
                : d
            )
          )
        } else {
          toast({ title: 'Error', description: 'Failed to add food entry.' })
        }
      } catch {
        toast({ title: 'Error', description: 'Failed to add food entry.' })
      }
    },
    []
  )

  // Remove food entry (delete from database)
  const removeFood = useCallback(async (id: string) => {
    try {
      const res = await fetch('/api/food', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (res.ok) {
        // Find the item being removed to update chart
        setFoodLog((prev) => {
          const item = prev.find((f) => f.id === id)
          if (item) {
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            const todayDayName = dayNames[new Date().getDay()]
            setChartData((prevChart) =>
              prevChart.map((d) =>
                d.date === todayDayName
                  ? { ...d, calories: Math.max(0, d.calories - item.calories) }
                  : d
              )
            )
          }
          return prev.filter((f) => f.id !== id)
        })
        // Pulse ring on value change
        setRingPulse(true)
        setTimeout(() => setRingPulse(false), 600)
        toast({ title: 'Food removed', description: 'Entry removed from your log.' })
      } else {
        toast({ title: 'Error', description: 'Failed to remove food entry.' })
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to remove food entry.' })
    }
  }, [])

  // AI Parse handler
  const handleAiParse = useCallback(() => {
    if (!aiInput.trim()) return
    setAiLoading(true)

    // Simulate a brief loading
    setTimeout(() => {
      const parsed = parseMealText(aiInput)
      setAiLoading(false)

      if (parsed.length === 0) {
        toast({
          title: 'No foods recognized',
          description: 'Try items like: roti, rice, dal, paneer, chicken, biryani...',
        })
        return
      }

      for (const p of parsed) {
        addFood({
          name: `${p.qty} ${p.name}`,
          calories: p.item.cal * p.qty,
          protein: p.item.protein * p.qty,
          carbs: p.item.carbs * p.qty,
          fats: p.item.fats * p.qty,
          fiber: p.item.fiber * p.qty,
          sugar: p.item.sugar * p.qty,
          sodium: p.item.sodium * p.qty,
        })
        toast({
          title: `Added: ${p.qty} ${p.name}`,
          description: `${p.item.cal * p.qty} kcal | P: ${(p.item.protein * p.qty).toFixed(1)}g | C: ${(p.item.carbs * p.qty).toFixed(1)}g | F: ${(p.item.fats * p.qty).toFixed(1)}g`,
        })
      }

      setAiInput('')
    }, 600)
  }, [aiInput, addFood])

  // Manual form submit
  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!formName.trim()) {
        toast({ title: 'Food name required', description: 'Please enter a food name.' })
        return
      }
      addFood({
        name: formName.trim(),
        calories: parseFloat(formCal) || 0,
        protein: parseFloat(formProtein) || 0,
        carbs: parseFloat(formCarbs) || 0,
        fats: parseFloat(formFats) || 0,
        fiber: parseFloat(formFiber) || 0,
        sugar: parseFloat(formSugar) || 0,
        sodium: parseFloat(formSodium) || 0,
      })
      toast({
        title: `Added: ${formName.trim()}`,
        description: `${formCal || 0} kcal added to your log.`,
      })
      setFormName('')
      setFormCal('')
      setFormProtein('')
      setFormCarbs('')
      setFormFats('')
      setFormFiber('')
      setFormSugar('')
      setFormSodium('')
    },
    [formName, formCal, formProtein, formCarbs, formFats, formFiber, formSugar, formSodium, addFood]
  )

  // Today's date formatted
  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // ─── Input style ──────────────────────────────────────────────────────
  const inputCls =
    'bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 px-3 py-2 text-sm w-full outline-none transition-all'

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Background decorative orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div
          className="floating-orb"
          style={{
            width: '500px',
            height: '500px',
            background: 'oklch(0.5 0.12 162 / 8%)',
            top: '-10%',
            left: '-5%',
            animationDelay: '0s',
          }}
        />
        <div
          className="floating-orb"
          style={{
            width: '400px',
            height: '400px',
            background: 'oklch(0.7 0.15 84 / 6%)',
            bottom: '-5%',
            right: '-5%',
            animationDelay: '-7s',
          }}
        />
        <div
          className="floating-orb"
          style={{
            width: '300px',
            height: '300px',
            background: 'oklch(0.65 0.18 47 / 5%)',
            top: '40%',
            right: '20%',
            animationDelay: '-14s',
          }}
        />
      </div>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          <span className="gradient-text-animated">
            Nutrition Tracker
          </span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Track your daily nutrition and make healthier choices
        </p>
      </motion.div>

      {/* Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6 items-start">
        {/* ─── LEFT SIDEBAR ──────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Streak + Balance Score Row */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={cardTransition}
            className="glass-card noise-overlay p-5"
          >
            <div className="relative z-10 flex items-center justify-between">
              {/* Streak Fire */}
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center">
                  <FlameKindling className="w-5 h-5 text-orange-400 fire-glow" />
                </div>
                <div>
                  <p className="text-lg font-bold text-orange-400">{streakDays}-day</p>
                  <p className="text-[11px] text-muted-foreground">Logging Streak</p>
                </div>
              </div>

              {/* Nutrient Balance Score */}
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-teal-400">{balanceScore}</p>
                  <p className="text-[11px] text-muted-foreground">Balance Score</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Calorie Ring Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ ...cardTransition, delay: 0.05 }}
            className="glass-card noise-overlay p-6"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="h-5 w-5 text-orange-400" />
                <h2 className="text-lg font-semibold text-foreground">Calories</h2>
              </div>
              <div className="flex justify-center">
                <div className={`relative ${ringPulse ? 'calorie-ring-pulse' : ''}`}>
                  <svg width="180" height="180" viewBox="0 0 180 180">
                    <defs>
                      <linearGradient id="calorieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="oklch(0.696 0.17 162.48)" />
                        <stop offset="100%" stopColor="oklch(0.828 0.189 84.429)" />
                      </linearGradient>
                    </defs>
                    {/* Background ring */}
                    <circle
                      cx="90"
                      cy="90"
                      r={RING_RADIUS}
                      fill="none"
                      stroke="oklch(1 0 0 / 8%)"
                      strokeWidth="12"
                    />
                    {/* Progress ring */}
                    <circle
                      cx="90"
                      cy="90"
                      r={RING_RADIUS}
                      fill="none"
                      stroke="url(#calorieGrad)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={RING_CIRCUMFERENCE}
                      strokeDashoffset={calorieOffset}
                      transform="rotate(-90 90 90)"
                      className="calorie-ring-animate"
                      style={{
                        transition: 'stroke-dashoffset 0.8s ease-out',
                      }}
                    />
                    {/* Center text */}
                    <text
                      x="90"
                      y="82"
                      textAnchor="middle"
                      className="fill-foreground text-2xl font-bold"
                      fontSize="28"
                      fontWeight="700"
                    >
                      {Math.round(totals.calories)}
                    </text>
                    <text
                      x="90"
                      y="108"
                      textAnchor="middle"
                      className="fill-muted-foreground"
                      fontSize="12"
                    >
                      / {CALORIE_GOAL} kcal
                    </text>
                  </svg>
                </div>
              </div>
              <div className="mt-3 flex justify-center gap-4 text-xs text-muted-foreground">
                <span>
                  <span className="text-teal-400 font-semibold">{CALORIE_GOAL - Math.round(totals.calories)}</span> remaining
                </span>
                <span>
                  <span className="text-amber-400 font-semibold">{Math.round(calorieProgress)}%</span> consumed
                </span>
              </div>
            </div>
          </motion.div>

          {/* Macronutrients Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ ...cardTransition, delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Drumstick className="h-5 w-5 text-teal-400" />
              <h2 className="text-lg font-semibold text-foreground">Macronutrients</h2>
            </div>
            <div className="space-y-4">
              <GradientProgressBar
                value={totals.protein}
                max={PROTEIN_GOAL}
                gradient="bg-gradient-to-r from-teal-500 to-emerald-500"
                label="Protein"
                unit="g"
                icon={Drumstick}
              />
              <GradientProgressBar
                value={totals.carbs}
                max={CARBS_GOAL}
                gradient="bg-gradient-to-r from-amber-400 to-yellow-500"
                label="Carbohydrates"
                unit="g"
                icon={Wheat}
              />
              <GradientProgressBar
                value={totals.fats}
                max={FATS_GOAL}
                gradient="bg-gradient-to-r from-orange-400 to-orange-600"
                label="Fats"
                unit="g"
                icon={Droplets}
              />
            </div>
          </motion.div>

          {/* Micronutrients Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ ...cardTransition, delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Leaf className="h-5 w-5 text-green-400" />
              <h2 className="text-lg font-semibold text-foreground">Micronutrients</h2>
            </div>
            <div className="space-y-4">
              <GradientProgressBar
                value={totals.fiber}
                max={FIBER_GOAL}
                gradient="bg-gradient-to-r from-green-400 to-emerald-500"
                label="Fiber"
                unit="g"
                icon={Leaf}
              />
              <GradientProgressBar
                value={totals.sugar}
                max={SUGAR_GOAL}
                gradient="bg-gradient-to-r from-pink-400 to-rose-500"
                label="Sugar"
                unit="g"
                icon={Candy}
              />
              <GradientProgressBar
                value={totals.sodium}
                max={SODIUM_GOAL}
                gradient="bg-gradient-to-r from-sky-400 to-blue-500"
                label="Sodium"
                unit="mg"
                icon={Waves}
              />
            </div>
          </motion.div>
        </div>

        {/* ─── RIGHT MAIN AREA ───────────────────────────────────────── */}
        <div className="space-y-6">
          {/* AI Meal Parser Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ ...cardTransition, delay: 0.15 }}
            className="glass-card p-6 dash-border-animated"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-teal-400" />
              <h2 className="text-lg font-semibold text-teal-400">Smart Meal Parser</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Describe your meal in natural language — e.g. &quot;2 roti, 1 bowl dal, 1 cup rice&quot;
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAiParse()
                }}
                placeholder="2 roti, 1 bowl dal, 1 cup rice..."
                className={inputCls}
                disabled={aiLoading}
              />
              <button
                onClick={handleAiParse}
                disabled={aiLoading}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {aiLoading ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Analyze
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {['2 roti, 1 bowl dal', '1 plate rice, 2 samosa', '1 dosa, 1 chai', '2 egg, 1 paratha'].map(
                (suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setAiInput(suggestion)
                    }}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground transition-all hover:bg-white/10 hover:text-foreground"
                  >
                    {suggestion}
                  </button>
                )
              )}
            </div>
          </motion.div>

          {/* Add Food Entry Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ ...cardTransition, delay: 0.25 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Plus className="h-5 w-5 text-teal-400" />
              <h2 className="text-lg font-semibold text-foreground">Add Food Entry</h2>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Food Name
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Grilled Chicken"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    value={formCal}
                    onChange={(e) => setFormCal(e.target.value)}
                    placeholder="0"
                    min="0"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    value={formProtein}
                    onChange={(e) => setFormProtein(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.1"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    value={formCarbs}
                    onChange={(e) => setFormCarbs(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.1"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Fats (g)
                  </label>
                  <input
                    type="number"
                    value={formFats}
                    onChange={(e) => setFormFats(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.1"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Fiber (g)
                  </label>
                  <input
                    type="number"
                    value={formFiber}
                    onChange={(e) => setFormFiber(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.1"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Sugar (g)
                  </label>
                  <input
                    type="number"
                    value={formSugar}
                    onChange={(e) => setFormSugar(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.1"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Sodium (mg)
                  </label>
                  <input
                    type="number"
                    value={formSodium}
                    onChange={(e) => setFormSodium(e.target.value)}
                    placeholder="0"
                    min="0"
                    className={inputCls}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-background transition-all hover:from-teal-400 hover:to-emerald-500"
              >
                <Plus className="h-4 w-4" />
                Add Food
              </button>
            </form>
          </motion.div>

          {/* Today's Food Log Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ ...cardTransition, delay: 0.35 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5 text-teal-400" />
                <h2 className="text-lg font-semibold text-foreground">Today&apos;s Food Log</h2>
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {todayStr}
              </span>
            </div>

            {/* Legend for color-coded categories */}
            <div className="flex items-center gap-4 mb-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400" /> Healthy
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Moderate
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400" /> High-cal
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-8 w-8 border-2 border-teal-400/30 border-t-teal-400 rounded-full animate-spin mb-3" />
                <p className="text-sm text-muted-foreground">Loading your food log...</p>
              </div>
            ) : foodLog.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-white/5 p-4 mb-3">
                  <UtensilsCrossed className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <p className="text-sm text-muted-foreground">No foods logged yet</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Use the Smart Parser or add food manually
                </p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
                {foodLog.map((item, index) => {
                  const category = getFoodCategory(item.name)
                  const CategoryIcon = getFoodCategoryIcon(item.name)
                  const categoryClass = category === 'healthy' ? 'food-healthy' : category === 'highcal' ? 'food-highcal' : 'food-moderate'
                  const iconColor = category === 'healthy' ? 'text-teal-400' : category === 'highcal' ? 'text-red-400' : 'text-amber-400'
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`flex items-center justify-between bg-white/3 border border-white/6 rounded-xl px-4 py-3 hover:bg-white/6 transition-colors group ${categoryClass}`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 ${iconColor}`}>
                          <CategoryIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            P: {item.protein.toFixed(1)}g &middot; C: {item.carbs.toFixed(1)}g
                            &middot; F: {item.fats.toFixed(1)}g
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-3">
                        <span className="text-sm font-semibold text-teal-400 whitespace-nowrap">
                          {Math.round(item.calories)} kcal
                        </span>
                        <button
                          onClick={() => removeFood(item.id)}
                          className="text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-lg p-1.5 transition-all opacity-0 group-hover:opacity-100"
                          aria-label={`Remove ${item.name}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {foodLog.length > 0 && (
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total</span>
                <span className="text-sm font-bold text-teal-400">
                  {Math.round(totals.calories)} kcal
                </span>
              </div>
            )}
          </motion.div>

          {/* Nutrition History Chart Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ ...cardTransition, delay: 0.45 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <History className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-semibold text-foreground">Nutrition History</h2>
              <span className="ml-auto text-xs text-muted-foreground">Last 7 days</span>
            </div>
            <NutritionChart data={chartData} />
            <div className="mt-3 pt-2 border-t border-white/6 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Avg: {chartData.length > 0 ? Math.round(chartData.reduce((a, d) => a + d.calories, 0) / chartData.length) : 0} kcal/day
              </span>
              <span>Goal: {CALORIE_GOAL} kcal</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
