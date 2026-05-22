'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Moon,
  Sun,
  Clock,
  Star,
  Bed,
  Flame,
  TrendingUp,
  Sparkles,
  RotateCcw,
  Zap,
  Heart,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Button } from '@/components/ui/button'

// ── Types ────────────────────────────────────────────────────────
interface SleepRecord {
  id: string
  bedtime: string
  wakeTime: string
  duration: number
  quality: number
  date: string
  createdAt: string
}

interface ChartDataPoint {
  day: string
  hours: number
  quality: number
}

// ── Constants ────────────────────────────────────────────────────
const IDEAL_BEDTIME = '22:00'
const IDEAL_WAKE_TIME = '06:00'
const IDEAL_DURATION = 8
const MAX_DURATION_BAR = 12

const AYURVEDIC_INSIGHTS = [
  {
    minHours: 0,
    maxHours: 5,
    title: 'Severely Sleep Deprived',
    icon: AlertTriangle,
    color: 'text-red-400',
    bg: 'bg-red-500/5 border-red-500/15',
    message: 'Your sleep is critically low. In Ayurveda, inadequate rest imbalances Vata dosha, leading to anxiety, dryness, and weakened immunity.',
    recommendations: [
      'Follow "Ratri" routine — be in bed by 10 PM (Kapha period ends)',
      'Drink warm milk with nutmeg and ashwagandha before bed',
      'Practice Nadi Shodhana (alternate nostril breathing) for 10 minutes',
      'Avoid screens 1 hour before sleep — read spiritual texts instead',
      'Apply warm sesame oil on feet (Padabhyanga) before sleeping',
    ],
  },
  {
    minHours: 5,
    maxHours: 6.5,
    title: 'Below Ideal Sleep',
    icon: AlertTriangle,
    color: 'text-orange-400',
    bg: 'bg-orange-500/5 border-orange-500/15',
    message: 'You\'re sleeping less than ideal. Ayurveda recommends 7-8 hours for most constitutions. Your current pattern may aggravate Pitta dosha.',
    recommendations: [
      'Aim to sleep during the Kapha period (6-10 PM) for deeper rest',
      'Take a warm bath with lavender and sandalwood essential oils',
      'Eat a light dinner by 7 PM — avoid heavy, spicy foods at night',
      'Practice Shavasana (corpse pose) for 5-10 minutes before bed',
      'Try Brahmari (humming bee breath) to calm the nervous system',
    ],
  },
  {
    minHours: 6.5,
    maxHours: 7.5,
    title: 'Moderate Sleep',
    icon: CheckCircle2,
    color: 'text-amber-400',
    bg: 'bg-amber-500/5 border-amber-500/15',
    message: 'Your sleep is decent but could improve. According to Ayurveda, the ideal "Ratri" sleep window is 10 PM to 6 AM for balanced doshas.',
    recommendations: [
      'Try sleeping 30 minutes earlier to align with Kapha time',
      'Use a sleep mask or darken your room completely',
      'Add triphala tea to your evening routine for gentle detox',
      'Listen to calming ragas like Darbari or Bhairavi before sleep',
      'Keep your sleeping direction toward the east or south',
    ],
  },
  {
    minHours: 7.5,
    maxHours: 9,
    title: 'Optimal Sleep',
    icon: Heart,
    color: 'text-teal-400',
    bg: 'bg-teal-500/5 border-teal-500/15',
    message: 'Excellent! Your sleep aligns beautifully with Ayurvedic "Ratri" principles. This duration supports balanced Kapha, Pitta, and Vata doshas.',
    recommendations: [
      'Maintain this consistent sleep schedule even on weekends',
      'Wake up during Brahma Muhurta (4:30-6 AM) for spiritual practices',
      'Start your morning with warm water and honey upon waking',
      'Practice Surya Namaskar in the morning light for energy',
      'Continue your evening routine of oil massage and pranayama',
    ],
  },
  {
    minHours: 9,
    maxHours: 24,
    title: 'Excessive Sleep',
    icon: Sparkles,
    color: 'text-purple-400',
    bg: 'bg-purple-500/5 border-purple-500/15',
    message: 'Sleeping too much can aggravate Kapha dosha, causing lethargy and sluggishness. Ayurveda recommends moderation even in rest.',
    recommendations: [
      'Reduce sleep gradually — try waking 15 minutes earlier each week',
      'Practice Kapalbhati pranayama in the morning to energize',
      'Avoid daytime napping (Divaswapna) as it imbalances Kapha',
      'Exercise in the morning to naturally regulate your sleep cycle',
      'Include warming spices like ginger and black pepper in your diet',
    ],
  },
]

const QUALITY_MESSAGES: Record<number, { text: string; emoji: string }> = {
  1: { text: 'Very poor sleep — consider your evening habits and seek guidance.', emoji: '😵' },
  2: { text: 'Restless night — try calming pranayama before bed.', emoji: '😟' },
  3: { text: 'Decent rest — small adjustments can make a big difference.', emoji: '😐' },
  4: { text: 'Good sleep! Your routine is working well.', emoji: '😊' },
  5: { text: 'Incredible rest! You\'re in perfect harmony with your body.', emoji: '🌟' },
}

// ── Utility Functions ────────────────────────────────────────────
function calculateDuration(bedtime: string, wakeTime: string): number {
  if (!bedtime || !wakeTime) return 0
  const [bh, bm] = bedtime.split(':').map(Number)
  const [wh, wm] = wakeTime.split(':').map(Number)
  if (isNaN(bh) || isNaN(bm) || isNaN(wh) || isNaN(wm)) return 0

  let bedMinutes = bh * 60 + bm
  let wakeMinutes = wh * 60 + wm

  // If wake time is before bedtime, it's the next day
  if (wakeMinutes <= bedMinutes) {
    wakeMinutes += 24 * 60
  }

  return (wakeMinutes - bedMinutes) / 60
}

function formatDuration(hours: number): string {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return `${h}h ${m}m`
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'Today'
  try {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

function getDayLabel(dateStr: string): string {
  if (!dateStr) return '?'
  try {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-IN', { weekday: 'short' })
  } catch {
    return '?'
  }
}

function getInsight(avgHours: number) {
  return AYURVEDIC_INSIGHTS.find(
    (i) => avgHours >= i.minHours && avgHours < i.maxHours
  ) || AYURVEDIC_INSIGHTS[AYURVEDIC_INSIGHTS.length - 1]
}

// ── Chart Tooltip ────────────────────────────────────────────────
function SleepTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; payload: ChartDataPoint }>
  label?: string
}) {
  if (!active || !payload || !payload.length) return null
  const data = payload[0].payload

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/15 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-bold text-teal-400">{data.hours.toFixed(1)} hrs</p>
      <p className="text-xs text-amber-400/80 mt-0.5">
        Quality: {'★'.repeat(data.quality)}{'☆'.repeat(5 - data.quality)}
      </p>
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────────
export default function SleepTracker() {
  const [bedtime, setBedtime] = useState('22:30')
  const [wakeTime, setWakeTime] = useState('06:00')
  const [quality, setQuality] = useState(3)
  const [entries, setEntries] = useState<SleepRecord[]>([])
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(false)

  // Calculate duration automatically
  const duration = useMemo(() => calculateDuration(bedtime, wakeTime), [bedtime, wakeTime])

  // Quality message
  const qualityMsg = useMemo(() => QUALITY_MESSAGES[quality] || QUALITY_MESSAGES[3], [quality])

  // Average duration for insights
  const avgDuration = useMemo(() => {
    if (entries.length === 0) return 0
    return entries.reduce((sum, e) => sum + e.duration, 0) / entries.length
  }, [entries])

  // Insight based on average
  const insight = useMemo(() => getInsight(avgDuration || duration), [avgDuration, duration])

  // Weekly chart data
  const chartData = useMemo<ChartDataPoint[]>(() => {
    if (entries.length === 0) return []
    return entries
      .slice()
      .reverse()
      .map((e) => ({
        day: getDayLabel(e.date),
        hours: e.duration,
        quality: e.quality,
      }))
  }, [entries])

  // Fetch entries on mount
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch('/api/sleep?userId=guest&days=7')
        if (res.ok) {
          const data = await res.json()
          setEntries(data)
          // Calculate streak
          if (data.length > 0) {
            let s = 0
            for (const entry of data) {
              if (entry.duration >= 7 && entry.duration <= 9) {
                s++
              } else {
                break
              }
            }
            setStreak(s)
          }
        }
      } catch {
        // silently fail
      }
    }
    fetchEntries()
  }, [])

  // Log sleep
  const handleLogSleep = useCallback(async () => {
    if (!bedtime || !wakeTime || duration <= 0) return

    setLoading(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      const res = await fetch('/api/sleep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bedtime,
          wakeTime,
          duration: Math.round(duration * 100) / 100,
          quality,
          date: today,
          userId: 'guest',
        }),
      })

      if (res.ok) {
        const newEntry = await res.json()
        setEntries((prev) => [newEntry, ...prev].slice(0, 7))

        // Update streak
        if (duration >= 7 && duration <= 9) {
          setStreak((s) => s + 1)
        } else {
          setStreak(0)
        }

        // Reset form
        setBedtime('22:30')
        setWakeTime('06:00')
        setQuality(3)
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [bedtime, wakeTime, duration, quality])

  const handleReset = () => {
    setBedtime('22:30')
    setWakeTime('06:00')
    setQuality(3)
  }

  // SVG duration bar
  const barWidth = Math.min((duration / MAX_DURATION_BAR) * 100, 100)
  const barColor =
    duration >= 7 && duration <= 9
      ? 'oklch(0.696 0.17 162.48)'
      : duration >= 6
        ? 'oklch(0.769 0.189 84.429)'
        : duration >= 4
          ? 'oklch(0.705 0.15 47)'
          : 'oklch(0.637 0.237 25.33)'

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-2"
      >
        <div className="flex items-center gap-2 mb-1">
          <Moon className="h-6 w-6 text-teal-400" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-teal-400 via-indigo-400 to-amber-400 bg-clip-text text-transparent">
              Sleep Tracker
            </span>
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Monitor your rest quality — Ayurvedic &quot;Ratri&quot; wisdom for better sleep
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — Sleep Logger */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Time Inputs */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <Bed className="h-5 w-5 text-teal-400" />
              <h3 className="text-lg font-semibold text-foreground">Log Your Sleep</h3>
            </div>

            {/* Bedtime */}
            <div className="space-y-2 mb-4">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Moon className="h-4 w-4 text-indigo-400" />
                Bedtime
              </label>
              <input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-foreground text-lg font-semibold focus:outline-none focus:border-teal-500/40 focus:ring-1 focus:ring-teal-500/20 transition-all [color-scheme:dark]"
              />
              <p className="text-xs text-muted-foreground/60">
                Ideal: 10 PM (Kapha period — best for falling asleep)
              </p>
            </div>

            {/* Wake Time */}
            <div className="space-y-2 mb-4">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Sun className="h-4 w-4 text-amber-400" />
                Wake-up Time
              </label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-foreground text-lg font-semibold focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all [color-scheme:dark]"
              />
              <p className="text-xs text-muted-foreground/60">
                Ideal: 6 AM (Brahma Muhurta — sacred morning hour)
              </p>
            </div>

            {/* Duration Display with SVG Bar */}
            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Clock className="h-4 w-4 text-teal-400" />
                  Duration
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={duration}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="text-sm font-bold"
                    style={{ color: barColor }}
                  >
                    {duration > 0 ? formatDuration(duration) : '—'}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* SVG Duration Bar */}
              <svg width="100%" height="24" viewBox="0 0 100 24" preserveAspectRatio="none" className="rounded-full overflow-hidden">
                {/* Background */}
                <rect x="0" y="0" width="100" height="24" rx="12" fill="oklch(1 0 0 / 6%)" />
                {/* Ideal zone marker (7-9 hrs) */}
                <rect
                  x={(7 / MAX_DURATION_BAR) * 100}
                  y="0"
                  width={((9 - 7) / MAX_DURATION_BAR) * 100}
                  height="24"
                  rx="0"
                  fill="oklch(0.696 0.17 162.48 / 8%)"
                />
                {/* Duration bar */}
                <motion.rect
                  x="0"
                  y="2"
                  width={0}
                  height="20"
                  rx="10"
                  fill={barColor}
                  initial={{ width: 0 }}
                  animate={{ width: barWidth }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ filter: `drop-shadow(0 0 6px ${barColor} / 40%)` }}
                />
                {/* Hour markers */}
                {[0, 2, 4, 6, 8, 10, 12].map((h) => (
                  <line
                    key={h}
                    x1={`${(h / MAX_DURATION_BAR) * 100}%`}
                    y1="0"
                    x2={`${(h / MAX_DURATION_BAR) * 100}%`}
                    y2="4"
                    stroke="oklch(1 0 0 / 20%)"
                    strokeWidth="0.5"
                  />
                ))}
              </svg>
              <div className="flex justify-between text-[10px] text-muted-foreground/40">
                <span>0h</span>
                <span>4h</span>
                <span className="text-teal-400/60">7-9h ideal</span>
                <span>12h</span>
              </div>
            </div>

            {/* Quality Rating */}
            <div className="space-y-3 mb-5">
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Star className="h-4 w-4 text-amber-400" />
                Sleep Quality
              </span>
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuality(i + 1)}
                    className="focus:outline-none"
                    aria-label={`Rate sleep quality ${i + 1} out of 5`}
                  >
                    <Star
                      className={`h-8 w-8 transition-colors duration-200 ${
                        i < quality
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-white/10'
                      }`}
                    />
                  </motion.button>
                ))}
                <span className="ml-2 text-sm font-semibold text-amber-400">{quality}/5</span>
              </div>
            </div>

            {/* Quality Message */}
            <AnimatePresence mode="wait">
              <motion.div
                key={quality}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center py-3 px-4 rounded-xl bg-amber-500/5 border border-amber-500/10 mb-4"
              >
                <span className="text-lg mr-2">{qualityMsg.emoji}</span>
                <span className="text-sm text-amber-400/90 font-medium">{qualityMsg.text}</span>
              </motion.div>
            </AnimatePresence>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleLogSleep}
                disabled={loading || duration <= 0}
                className="flex-1 bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-400 hover:to-indigo-400 text-background font-semibold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all border-0"
              >
                <Moon className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Log Sleep'}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-white/10 hover:border-teal-500/30 hover:bg-teal-500/10 hover:text-teal-400 transition-all"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Sleep Streak & Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-5 w-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-foreground">Sleep Stats</h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <Flame className="h-5 w-5 text-orange-400 mb-1" />
                <motion.span
                  key={streak}
                  initial={{ scale: 1.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-lg font-bold text-foreground"
                >
                  {streak}
                </motion.span>
                <span className="text-[10px] text-muted-foreground">Day Streak</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <Clock className="h-5 w-5 text-teal-400 mb-1" />
                <motion.span
                  key={avgDuration.toFixed(1)}
                  initial={{ scale: 1.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-lg font-bold text-foreground"
                >
                  {entries.length > 0 ? avgDuration.toFixed(1) : '—'}
                </motion.span>
                <span className="text-[10px] text-muted-foreground">Avg Hours</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <TrendingUp className="h-5 w-5 text-emerald-400 mb-1" />
                <motion.span
                  key={entries.length > 0 ? Math.round(entries.reduce((s, e) => s + e.quality, 0) / entries.length) : 0}
                  initial={{ scale: 1.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-lg font-bold text-foreground"
                >
                  {entries.length > 0
                    ? (entries.reduce((s, e) => s + e.quality, 0) / entries.length).toFixed(1)
                    : '—'}
                </motion.span>
                <span className="text-[10px] text-muted-foreground">Avg Quality</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right — Chart, Insights & History */}
        <div className="space-y-6">
          {/* Weekly Sleep Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-teal-400" />
              <h3 className="text-lg font-semibold text-foreground">Weekly Sleep</h3>
            </div>

            {chartData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Moon className="h-10 w-10 text-muted-foreground/20 mb-3" />
                <p className="text-sm text-muted-foreground">No sleep data yet</p>
                <p className="text-xs text-muted-foreground/50 mt-1">Log your first sleep to see the chart</p>
              </div>
            ) : (
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.696 0.17 162.48)" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="oklch(0.696 0.17 162.48)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(1 0 0 / 6%)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="day"
                      tick={{ fill: 'oklch(0.7 0 0)', fontSize: 12 }}
                      axisLine={{ stroke: 'oklch(1 0 0 / 10%)' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: 'oklch(0.7 0 0)', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 12]}
                    />
                    <Tooltip content={<SleepTooltip />} cursor={{ fill: 'oklch(1 0 0 / 4%)' }} />
                    <ReferenceLine
                      y={IDEAL_DURATION}
                      stroke="oklch(0.769 0.189 84.429)"
                      strokeDasharray="6 4"
                      strokeWidth={1.5}
                      label={{
                        value: 'Ideal 8h',
                        position: 'right',
                        fill: 'oklch(0.769 0.189 84.429)',
                        fontSize: 10,
                      }}
                    />
                    <ReferenceLine
                      y={7}
                      stroke="oklch(0.696 0.17 162.48 / 30%)"
                      strokeDasharray="3 3"
                      strokeWidth={1}
                    />
                    <ReferenceLine
                      y={9}
                      stroke="oklch(0.696 0.17 162.48 / 30%)"
                      strokeDasharray="3 3"
                      strokeWidth={1}
                    />
                    <Area
                      type="monotone"
                      dataKey="hours"
                      stroke="oklch(0.696 0.17 162.48)"
                      strokeWidth={2.5}
                      fill="url(#sleepGradient)"
                      dot={{ fill: 'oklch(0.696 0.17 162.48)', r: 4, strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: 'oklch(0.696 0.17 162.48)', stroke: 'oklch(1 0 0 / 20%)', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>

          {/* Ayurvedic Sleep Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <insight.icon className={`h-5 w-5 ${insight.color}`} />
              <h3 className="text-lg font-semibold text-foreground">{insight.title}</h3>
            </div>

            {/* Insight Message */}
            <div className={`p-3 rounded-xl ${insight.bg} mb-4`}>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {insight.message}
              </p>
            </div>

            {/* Ratri Period Indicator */}
            <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <Zap className="h-4 w-4 text-amber-400 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="text-amber-400 font-semibold">Ratri Period:</span>{' '}
                Ayurveda divides night into Kapha (6-10 PM), Pitta (10 PM-2 AM), and Vata (2-6 AM).
                Sleep during Kapha time for deepest, most restorative rest.
              </p>
            </div>

            {/* Recommendations */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={insight.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  {insight.recommendations.map((rec, i) => (
                    <motion.div
                      key={rec}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.3 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
                    >
                      <span className="shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-teal-500/20 to-indigo-500/20 flex items-center justify-center text-xs font-bold text-teal-400">
                        {i + 1}
                      </span>
                      <p className="text-sm text-muted-foreground leading-relaxed">{rec}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Recent Sleep History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-teal-400" />
              <h3 className="text-lg font-semibold text-foreground">Recent Sleep History</h3>
            </div>

            {entries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bed className="h-8 w-8 text-muted-foreground/20 mb-2" />
                <p className="text-sm text-muted-foreground">No sleep entries yet</p>
                <p className="text-xs text-muted-foreground/50 mt-1">Log your first night&apos;s sleep above</p>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {entries.map((entry, i) => {
                  const entryDuration = entry.duration
                  const isOptimal = entryDuration >= 7 && entryDuration <= 9
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isOptimal
                            ? 'bg-teal-500/10'
                            : entryDuration >= 6
                              ? 'bg-amber-500/10'
                              : 'bg-red-500/10'
                        }`}
                      >
                        <Moon
                          className={`h-5 w-5 ${
                            isOptimal
                              ? 'text-teal-400'
                              : entryDuration >= 6
                                ? 'text-amber-400'
                                : 'text-red-400'
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {formatDate(entry.date)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {entry.bedtime} → {entry.wakeTime}
                        </p>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <span
                          className={`text-sm font-bold ${
                            isOptimal
                              ? 'text-teal-400'
                              : entryDuration >= 6
                                ? 'text-amber-400'
                                : 'text-red-400'
                          }`}
                        >
                          {formatDuration(entryDuration)}
                        </span>
                        <span className="text-[10px] text-amber-400/80">
                          {'★'.repeat(entry.quality)}{'☆'.repeat(5 - entry.quality)}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
