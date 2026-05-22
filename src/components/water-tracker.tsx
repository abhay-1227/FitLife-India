'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Droplets,
  Plus,
  Minus,
  Trophy,
  Flame,
  GlassWater,
  Clock,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const GLASS_ML = 250
const DAILY_GOAL_GLASSES = 8
const DAILY_GOAL_ML = DAILY_GOAL_GLASSES * GLASS_ML

function getMotivationalMessage(glasses: number, goal: number): { text: string; emoji: string } {
  const pct = glasses / goal
  if (pct === 0) return { text: 'Start your hydration journey! Drink your first glass.', emoji: '💧' }
  if (pct < 0.25) return { text: 'Good start! Keep sipping water throughout the day.', emoji: '🌱' }
  if (pct < 0.5) return { text: 'You\'re making progress! Stay consistent.', emoji: '🌿' }
  if (pct < 0.75) return { text: 'Over halfway there! Your body thanks you.', emoji: '💪' }
  if (pct < 1) return { text: 'Almost there! Just a few more glasses to go.', emoji: '🔥' }
  return { text: 'Amazing! You\'ve reached your daily hydration goal! 🎉', emoji: '🏆' }
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

interface WaterEntry {
  id: string
  time: Date
  ml: number
}

export default function WaterTracker() {
  const [glasses, setGlasses] = useState(0)
  const [history, setHistory] = useState<WaterEntry[]>([])
  const [streak, setStreak] = useState(1)

  const totalMl = glasses * GLASS_ML
  const progressPct = Math.min((glasses / DAILY_GOAL_GLASSES) * 100, 100)
  const message = useMemo(() => getMotivationalMessage(glasses, DAILY_GOAL_GLASSES), [glasses])

  // SVG circular progress
  const radius = 90
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progressPct / 100) * circumference

  const addGlass = () => {
    const newGlasses = glasses + 1
    setGlasses(newGlasses)
    setHistory((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, time: new Date(), ml: GLASS_ML },
    ])
    if (newGlasses >= DAILY_GOAL_GLASSES && glasses < DAILY_GOAL_GLASSES) {
      setStreak((s) => s + 1)
    }
  }

  const removeGlass = () => {
    if (glasses > 0) {
      setGlasses((g) => g - 1)
      setHistory((prev) => prev.slice(0, -1))
    }
  }

  const handleReset = () => {
    setGlasses(0)
    setHistory([])
  }

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
          <Droplets className="h-6 w-6 text-teal-400" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent">
              Water Tracker
            </span>
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Stay hydrated — track your daily water intake
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — Circular Progress & Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-6"
        >
          {/* Circular Progress */}
          <div className="flex justify-center py-4">
            <div className="relative w-52 h-52">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="oklch(0.696 0.17 162.48)" />
                    <stop offset="100%" stopColor="oklch(0.765 0.177 163.22)" />
                  </linearGradient>
                </defs>
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke="oklch(1 0 0 / 8%)"
                  strokeWidth="12"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke="url(#waterGrad)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{
                    filter: 'drop-shadow(0 0 8px oklch(0.696 0.17 162.48 / 40%))',
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  key={glasses}
                  initial={{ scale: 1.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-4xl font-bold text-foreground"
                >
                  {glasses}
                </motion.span>
                <span className="text-xs text-muted-foreground">of {DAILY_GOAL_GLASSES} glasses</span>
                <span className="text-sm font-semibold text-teal-400 mt-1">
                  {totalMl} / {DAILY_GOAL_ML} ml
                </span>
              </div>
            </div>
          </div>

          {/* Motivational Message */}
          <AnimatePresence mode="wait">
            <motion.div
              key={message.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center py-3 px-4 rounded-xl bg-teal-500/5 border border-teal-500/10 mb-5"
            >
              <span className="text-lg mr-2">{message.emoji}</span>
              <span className="text-sm text-teal-400/90 font-medium">{message.text}</span>
            </motion.div>
          </AnimatePresence>

          {/* Add/Remove Controls */}
          <div className="flex items-center justify-center gap-4 mb-5">
            <Button
              onClick={removeGlass}
              disabled={glasses === 0}
              variant="outline"
              size="lg"
              className="w-16 h-16 rounded-2xl border-white/10 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-30 transition-all p-0"
            >
              <Minus className="h-6 w-6" />
            </Button>

            <Button
              onClick={addGlass}
              size="lg"
              className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-background shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all border-0 p-0"
            >
              <Plus className="h-8 w-8" />
            </Button>

            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="w-16 h-16 rounded-2xl border-white/10 hover:border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-400 transition-all p-0"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>

          {/* Glass count label */}
          <p className="text-center text-xs text-muted-foreground">
            Each glass = {GLASS_ML}ml
          </p>
        </motion.div>

        {/* Right — Water Drops & History */}
        <div className="space-y-6">
          {/* Visual Water Drops */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <GlassWater className="h-5 w-5 text-teal-400" />
              <h3 className="text-lg font-semibold text-foreground">Today&apos;s Glasses</h3>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: DAILY_GOAL_GLASSES }).map((_, i) => {
                const filled = i < glasses
                return (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-300 ${
                      filled
                        ? 'bg-teal-500/10 border-teal-500/20 shadow-lg shadow-teal-500/5'
                        : 'bg-white/[0.02] border-white/[0.06]'
                    }`}
                  >
                    <motion.div
                      animate={filled ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <Droplets
                        className={`h-7 w-7 transition-colors duration-300 ${
                          filled ? 'text-teal-400' : 'text-white/10'
                        }`}
                        fill={filled ? 'oklch(0.696 0.17 162.48 / 40%)' : 'none'}
                      />
                    </motion.div>
                    <span className={`text-[10px] font-medium ${filled ? 'text-teal-400' : 'text-white/15'}`}>
                      {i + 1}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Streak & Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-amber-400" />
              <h3 className="text-lg font-semibold text-foreground">Hydration Stats</h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <Flame className="h-5 w-5 text-orange-400 mb-1" />
                <span className="text-lg font-bold text-foreground">{streak}</span>
                <span className="text-[10px] text-muted-foreground">Day Streak</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <Droplets className="h-5 w-5 text-teal-400 mb-1" />
                <span className="text-lg font-bold text-foreground">{totalMl}</span>
                <span className="text-[10px] text-muted-foreground">ml Today</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <GlassWater className="h-5 w-5 text-emerald-400 mb-1" />
                <span className="text-lg font-bold text-foreground">{Math.round(progressPct)}%</span>
                <span className="text-[10px] text-muted-foreground">Complete</span>
              </div>
            </div>
          </motion.div>

          {/* Hydration Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-teal-400" />
              <h3 className="text-lg font-semibold text-foreground">Today&apos;s Timeline</h3>
            </div>

            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Droplets className="h-8 w-8 text-muted-foreground/20 mb-2" />
                <p className="text-sm text-muted-foreground">No water logged yet</p>
                <p className="text-xs text-muted-foreground/50 mt-1">Tap + to add your first glass</p>
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {history.map((entry, i) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
                      <Droplets className="h-4 w-4 text-teal-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">Glass {i + 1}</p>
                      <p className="text-xs text-muted-foreground">{entry.ml}ml</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatTime(entry.time)}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
