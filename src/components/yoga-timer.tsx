'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  Square,
  Timer,
  Zap,
  Trophy,
  ChevronRight,
  Bell,
  Flame,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

// ─── Types ──────────────────────────────────────────────────────

interface TimerPose {
  name: string
  sanskrit: string
  description: string
  duration: number // seconds per pose
  caloriesPerMin: number
}

interface SessionPreset {
  id: string
  name: string
  description: string
  totalMinutes: number
  icon: React.ReactNode
  poses: TimerPose[]
}

interface SessionHistory {
  id: string
  name: string
  duration: number
  posesCount: number
  completedAt: string
}

type TimerState = 'idle' | 'running' | 'paused' | 'transitioning' | 'completed'

// ─── Pose Data ──────────────────────────────────────────────────

const allPoses: TimerPose[] = [
  {
    name: 'Tadasana',
    sanskrit: 'Tāḍāsana',
    description: 'Mountain Pose — the foundation of all standing poses. Stand tall with conscious breathing.',
    duration: 60,
    caloriesPerMin: 2,
  },
  {
    name: 'Surya Namaskar',
    sanskrit: 'Sūrya Namaskāra',
    description: 'Sun Salutation — a flowing sequence that warms the body and honors the sun.',
    duration: 90,
    caloriesPerMin: 5,
  },
  {
    name: 'Bhujangasana',
    sanskrit: 'Bhujaṅgāsana',
    description: 'Cobra Pose — opens the chest, strengthens the spine, and energizes the body.',
    duration: 60,
    caloriesPerMin: 3,
  },
  {
    name: 'Anulom Vilom',
    sanskrit: 'Anuloma Viloma',
    description: 'Alternate Nostril Breathing — balances left and right energy channels.',
    duration: 90,
    caloriesPerMin: 1.5,
  },
  {
    name: 'Padmasana',
    sanskrit: 'Padmāsana',
    description: 'Lotus Pose — the classic meditation posture that calms the mind.',
    duration: 90,
    caloriesPerMin: 1,
  },
  {
    name: 'Bhramari',
    sanskrit: 'Bhramarī',
    description: 'Humming Bee Breath — a soothing practice using a gentle humming sound.',
    duration: 75,
    caloriesPerMin: 1,
  },
  {
    name: 'Vrikshasana',
    sanskrit: 'Vṛkṣāsana',
    description: 'Tree Pose — cultivates balance, focus, and grounding energy.',
    duration: 60,
    caloriesPerMin: 2.5,
  },
  {
    name: 'Shavasana',
    sanskrit: 'Śavāsana',
    description: 'Corpse Pose — deep relaxation to integrate the benefits of your practice.',
    duration: 120,
    caloriesPerMin: 0.5,
  },
  {
    name: 'Trikonasana',
    sanskrit: 'Trikonāsana',
    description: 'Triangle Pose — stretches the side body and strengthens legs.',
    duration: 60,
    caloriesPerMin: 3,
  },
  {
    name: 'Kapalbhati',
    sanskrit: 'Kapālabhāti',
    description: 'Skull Shining Breath — a powerful cleansing technique with rapid exhalations.',
    duration: 75,
    caloriesPerMin: 2,
  },
  {
    name: 'Ujjayi',
    sanskrit: 'Ujjāyī',
    description: 'Victorious Breath — a deep, oceanic breathing technique that builds internal heat.',
    duration: 75,
    caloriesPerMin: 1.5,
  },
  {
    name: 'Danda Bethak',
    sanskrit: "Daṇḍa Bait'hak",
    description: 'Traditional Indian push-up and squat combination — builds raw functional strength.',
    duration: 90,
    caloriesPerMin: 6,
  },
]

const presets: SessionPreset[] = [
  {
    id: 'morning',
    name: 'Morning Energizer',
    description: 'Start your day with energy and focus',
    totalMinutes: 5,
    icon: <Zap className="size-5" />,
    poses: [
      allPoses[0], // Tadasana
      allPoses[1], // Surya Namaskar
      allPoses[2], // Bhujangasana
      allPoses[3], // Anulom Vilom
    ],
  },
  {
    id: 'stress',
    name: 'Stress Relief',
    description: 'Calm your mind and release tension',
    totalMinutes: 10,
    icon: <Sparkles className="size-5" />,
    poses: [
      allPoses[4], // Padmasana
      allPoses[5], // Bhramari
      allPoses[6], // Vrikshasana
      allPoses[7], // Shavasana
    ],
  },
  {
    id: 'full',
    name: 'Full Practice',
    description: 'Complete session with all 12 poses',
    totalMinutes: 20,
    icon: <Flame className="size-5" />,
    poses: [...allPoses],
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Choose your own poses',
    totalMinutes: 0,
    icon: <Plus className="size-5" />,
    poses: [],
  },
]

// ─── Component ──────────────────────────────────────────────────

export default function YogaTimer() {
  // Timer state
  const [timerState, setTimerState] = useState<TimerState>('idle')
  const [selectedPreset, setSelectedPreset] = useState<SessionPreset | null>(null)
  const [customPoses, setCustomPoses] = useState<TimerPose[]>([])
  const [showCustomPicker, setShowCustomPicker] = useState(false)
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [totalElapsed, setTotalElapsed] = useState(0)
  const [showBell, setShowBell] = useState(false)
  const [sessionHistory, setSessionHistory] = useState<SessionHistory[]>([])
  const [showSummary, setShowSummary] = useState(false)
  const [summaryData, setSummaryData] = useState<{ name: string; duration: number; posesCount: number; calories: number } | null>(null)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Get active poses
  const activePoses = selectedPreset?.id === 'custom' ? customPoses : (selectedPreset?.poses ?? [])

  const fetchSessionHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/yoga-session?userId=guest')
      if (res.ok) {
        const data = await res.json()
        setSessionHistory(data.slice(0, 5))
      }
    } catch {
      // silently fail
    }
  }, [])

  // Fetch session history on mount via event
  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/yoga-session?userId=guest', { signal: controller.signal })
      .then(res => res.ok ? res.json() : [])
      .then(data => setSessionHistory(data.slice(0, 5)))
      .catch(() => {})
    return () => controller.abort()
  }, [])

  // Save completed session
  const saveSession = async (name: string, duration: number, posesCount: number) => {
    try {
      await fetch('/api/yoga-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          duration,
          posesCount,
          userId: 'guest',
        }),
      })
      fetchSessionHistory()
    } catch {
      // silently fail
    }
  }

  // Calculate total session time
  const getTotalTime = useCallback((poses: TimerPose[]) => {
    return poses.reduce((sum, p) => sum + p.duration, 0)
  }, [])

  // Calculate total calories for a set of poses given total minutes
  const calculateCalories = useCallback((poses: TimerPose[], totalSeconds: number) => {
    const totalMinutes = totalSeconds / 60
    const avgCaloriesPerMin = poses.length > 0
      ? poses.reduce((sum, p) => sum + p.caloriesPerMin, 0) / poses.length
      : 2
    return Math.round(avgCaloriesPerMin * totalMinutes)
  }, [])

  // Start a session
  const startSession = useCallback((preset: SessionPreset, poses: TimerPose[]) => {
    if (poses.length === 0) return
    setCurrentPoseIndex(0)
    setTimeRemaining(poses[0].duration)
    setTotalElapsed(0)
    setTimerState('running')
    setShowSummary(false)
    setSelectedPreset(preset)
  }, [])

  // Timer tick
  useEffect(() => {
    if (timerState === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Pose finished
            return 0
          }
          return prev - 1
        })
        setTotalElapsed((prev) => prev + 1)
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [timerState])

  // Handle pose completion (auto-advance)
  const handlePoseComplete = useCallback(() => {
    setShowBell(true)
    setTimerState('transitioning')

    transitionTimeoutRef.current = setTimeout(() => {
      setShowBell(false)
      setCurrentPoseIndex((prevIndex) => {
        const nextIndex = prevIndex + 1
        if (nextIndex < activePoses.length) {
          setTimeRemaining(activePoses[nextIndex].duration)
          setTimerState('running')
        } else {
          setTimerState('completed')
          const calories = calculateCalories(activePoses, totalElapsed)
          setSummaryData({
            name: selectedPreset?.name ?? 'Custom Session',
            duration: totalElapsed,
            posesCount: activePoses.length,
            calories,
          })
          setShowSummary(true)
          saveSession(
            selectedPreset?.name ?? 'Custom Session',
            totalElapsed,
            activePoses.length
          )
        }
        return nextIndex < activePoses.length ? nextIndex : prevIndex
      })
    }, 2000)
  }, [activePoses, totalElapsed, calculateCalories, selectedPreset])

  useEffect(() => {
    if (timeRemaining === 0 && timerState === 'running') {
      // Use setTimeout to avoid synchronous setState in effect
      const tid = setTimeout(() => handlePoseComplete(), 0)
      return () => clearTimeout(tid)
    }
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current)
        transitionTimeoutRef.current = null
      }
    }
  }, [timeRemaining, timerState, handlePoseComplete])

  // Controls
  const handlePause = () => setTimerState('paused')
  const handleResume = () => setTimerState('running')
  const handleStop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
    setTimerState('idle')
    setCurrentPoseIndex(0)
    setTimeRemaining(0)
    setTotalElapsed(0)
    setShowBell(false)
  }

  // Back to presets
  const handleBack = () => {
    handleStop()
    setSelectedPreset(null)
    setShowCustomPicker(false)
    setCustomPoses([])
    setShowSummary(false)
  }

  // Custom pose toggle
  const toggleCustomPose = (pose: TimerPose) => {
    setCustomPoses((prev) => {
      const exists = prev.find((p) => p.name === pose.name)
      if (exists) return prev.filter((p) => p.name !== pose.name)
      return [...prev, pose]
    })
  }

  // Format time
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  // SVG circular progress
  const currentPose = activePoses[currentPoseIndex]
  const poseDuration = currentPose?.duration ?? 1
  const progress = currentPose ? (poseDuration - timeRemaining) / poseDuration : 0
  const circumference = 2 * Math.PI * 120
  const strokeDashoffset = circumference * (1 - progress)

  // ─── Idle Screen (Preset Selection) ─────────────────────────

  if (timerState === 'idle' && !selectedPreset) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
            <Timer className="size-4 text-orange-400" />
            <span className="text-sm font-medium text-orange-400">Session Timer</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Guided Yoga Sessions
            </span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Choose a preset or create a custom session. Follow along pose-by-pose with our guided timer.
          </p>
        </motion.div>

        {/* Preset Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {presets.map((preset, index) => (
            <motion.div
              key={preset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => {
                  if (preset.id === 'custom') {
                    setSelectedPreset(preset)
                    setShowCustomPicker(true)
                  } else {
                    startSession(preset, preset.poses)
                  }
                }}
                className="glass-card w-full p-6 text-left group cursor-pointer"
              >
                <div className="size-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/20 flex items-center justify-center mb-4 group-hover:from-orange-500/30 group-hover:to-amber-500/20 transition-all">
                  <span className="text-orange-400 group-hover:text-orange-300 transition-colors">
                    {preset.icon}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-orange-300 transition-colors mb-1">
                  {preset.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{preset.description}</p>
                <div className="flex items-center gap-3">
                  {preset.id !== 'custom' && (
                    <>
                      <Badge className="bg-orange-500/15 text-orange-400 border-orange-500/20 text-xs border">
                        <Clock className="size-3 mr-1" />
                        {preset.totalMinutes} min
                      </Badge>
                      <Badge className="bg-teal-500/15 text-teal-400 border-teal-500/20 text-xs border">
                        {preset.poses.length} poses
                      </Badge>
                    </>
                  )}
                  {preset.id === 'custom' && (
                    <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/20 text-xs border">
                      Pick your poses
                    </Badge>
                  )}
                </div>
                <ChevronRight className="size-4 text-muted-foreground/30 ml-auto mt-3 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Session History */}
        {sessionHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Trophy className="size-5 text-amber-400" />
              Recent Sessions
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {sessionHistory.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5"
                >
                  <div className="size-10 rounded-lg bg-gradient-to-br from-orange-500/15 to-amber-500/10 flex items-center justify-center shrink-0">
                    <Flame className="size-4 text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{session.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.posesCount} poses · {formatTime(session.duration)}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0">
                    {new Date(session.completedAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    )
  }

  // ─── Custom Pose Picker ────────────────────────────────────

  if (showCustomPicker && selectedPreset?.id === 'custom' && timerState === 'idle') {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Back button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="size-4" />
            Back to presets
          </button>

          <h2 className="text-2xl font-bold mb-2">
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Choose Your Poses
            </span>
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Select the poses for your custom session. Each pose has a default duration you can adjust.
          </p>

          {/* Selected summary */}
          {customPoses.length > 0 && (
            <div className="glass-card p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-orange-500/15 flex items-center justify-center">
                  <Flame className="size-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {customPoses.length} pose{customPoses.length !== 1 ? 's' : ''} selected
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total: {formatTime(getTotalTime(customPoses))}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => startSession(selectedPreset, customPoses)}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-background font-semibold shadow-lg shadow-orange-500/25 border-0"
              >
                <Play className="size-4 mr-2" />
                Start Session
              </Button>
            </div>
          )}

          {/* Pose list */}
          <div className="grid gap-3">
            {allPoses.map((pose) => {
              const isSelected = customPoses.some((p) => p.name === pose.name)
              return (
                <button
                  key={pose.name}
                  onClick={() => toggleCustomPose(pose)}
                  className={`glass-card p-4 flex items-center gap-4 text-left transition-all ${
                    isSelected
                      ? 'border-orange-500/40 bg-orange-500/5'
                      : 'hover:border-white/20'
                  }`}
                  style={{ borderRadius: 16 }}
                >
                  <div
                    className={`size-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? 'bg-orange-500/20 border border-orange-500/40'
                        : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    {isSelected ? (
                      <CheckCircle2 className="size-5 text-orange-400" />
                    ) : (
                      <Plus className="size-5 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${isSelected ? 'text-orange-300' : 'text-foreground'}`}>
                      {pose.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{pose.sanskrit}</p>
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0">
                    {formatTime(pose.duration)}
                  </div>
                </button>
              )
            })}
          </div>
        </motion.div>
      </div>
    )
  }

  // ─── Session Complete Summary ───────────────────────────────

  if (showSummary && summaryData) {
    return (
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="glass-card p-8 text-center"
        >
          {/* Trophy animation */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
            className="size-20 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-6"
          >
            <Trophy className="size-10 text-amber-400" />
          </motion.div>

          <h2 className="text-2xl font-bold mb-2">
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Session Complete!
            </span>
          </h2>
          <p className="text-muted-foreground text-sm mb-6">{summaryData.name}</p>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="glass-card p-4" style={{ borderRadius: 16 }}>
              <Clock className="size-5 text-teal-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-foreground">{formatTime(summaryData.duration)}</p>
              <p className="text-xs text-muted-foreground">Total Time</p>
            </div>
            <div className="glass-card p-4" style={{ borderRadius: 16 }}>
              <CheckCircle2 className="size-5 text-orange-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-foreground">{summaryData.posesCount}</p>
              <p className="text-xs text-muted-foreground">Poses Done</p>
            </div>
            <div className="glass-card p-4" style={{ borderRadius: 16 }}>
              <Flame className="size-5 text-amber-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-foreground">~{summaryData.calories}</p>
              <p className="text-xs text-muted-foreground">Calories</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => {
                setShowSummary(false)
                const preset = selectedPreset
                if (preset) {
                  const poses = preset.id === 'custom' ? customPoses : preset.poses
                  startSession(preset, poses)
                }
              }}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-background font-semibold shadow-lg shadow-orange-500/25 border-0"
            >
              <Play className="size-4 mr-2" />
              Restart Session
            </Button>
            <Button
              variant="ghost"
              onClick={handleBack}
              className="w-full text-muted-foreground hover:text-foreground"
            >
              Back to Presets
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ─── Active Timer ──────────────────────────────────────────

  const nextPose = currentPoseIndex < activePoses.length - 1 ? activePoses[currentPoseIndex + 1] : null

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="size-4" />
          Exit session
        </button>
      </motion.div>

      {/* Session name badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <Badge className="bg-orange-500/15 text-orange-400 border-orange-500/20 border text-sm px-4 py-1.5">
          {selectedPreset?.name}
        </Badge>
        <p className="text-xs text-muted-foreground mt-2">
          Pose {currentPoseIndex + 1} of {activePoses.length}
        </p>
      </motion.div>

      {/* Circular Timer */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <svg width="280" height="280" viewBox="0 0 280 280" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="140"
              cy="140"
              r="120"
              fill="none"
              stroke="oklch(1 0 0 / 6%)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <motion.circle
              cx="140"
              cy="140"
              r="120"
              fill="none"
              stroke="url(#timerGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={false}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="oklch(0.78 0.17 55)" />
                <stop offset="100%" stopColor="oklch(0.828 0.189 84.429)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {showBell ? (
                <motion.div
                  key="bell"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    animate={{
                      rotate: [0, 15, -15, 10, -10, 0],
                      scale: [1, 1.2, 1, 1.1, 1],
                    }}
                    transition={{ duration: 1, repeat: 1 }}
                  >
                    <Bell className="size-12 text-amber-400" />
                  </motion.div>
                  <p className="text-sm text-amber-400 font-medium mt-3">
                    {nextPose ? 'Next pose...' : 'Completing...'}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="timer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-5xl font-bold text-foreground tabular-nums tracking-tight">
                    {formatTime(timeRemaining)}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">remaining</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Glow effect */}
          <div
            className="absolute inset-0 rounded-full opacity-20 blur-2xl pointer-events-none"
            style={{
              background: timerState === 'running'
                ? 'radial-gradient(circle, oklch(0.78 0.17 55 / 30%) 0%, transparent 70%)'
                : 'none',
            }}
          />
        </div>
      </div>

      {/* Current Pose Display */}
      <AnimatePresence mode="wait">
        {currentPose && (
          <motion.div
            key={currentPoseIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="glass-card p-6 mb-4 text-center"
            style={{ borderRadius: 20 }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
              {currentPose.name}
            </h3>
            <p className="text-base text-orange-400/80 font-medium mb-3">
              {currentPose.sanskrit}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              {currentPose.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next Pose Preview */}
      {nextPose && timerState !== 'transitioning' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 mb-6"
        >
          <div className="size-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
            <ChevronRight className="size-4 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Next Pose</p>
            <p className="text-sm font-medium text-foreground">{nextPose.name}</p>
          </div>
          <span className="text-xs text-muted-foreground">{formatTime(nextPose.duration)}</span>
        </motion.div>
      )}

      {/* Pose progress dots */}
      <div className="flex items-center justify-center gap-1.5 mb-6 flex-wrap">
        {activePoses.map((_, idx) => (
          <div
            key={idx}
            className={`size-2.5 rounded-full transition-all duration-300 ${
              idx < currentPoseIndex
                ? 'bg-orange-400'
                : idx === currentPoseIndex
                ? 'bg-orange-400 scale-125 shadow-lg shadow-orange-500/40'
                : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        {timerState === 'running' && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePause}
            className="size-14 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/15 transition-colors"
            aria-label="Pause"
          >
            <Pause className="size-6 text-foreground" />
          </motion.button>
        )}

        {timerState === 'paused' && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleResume}
            className="size-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-shadow"
            aria-label="Resume"
          >
            <Play className="size-7 text-background ml-1" />
          </motion.button>
        )}

        {timerState === 'transitioning' && (
          <div className="size-14 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Bell className="size-6 text-amber-400" />
            </motion.div>
          </div>
        )}

        {(timerState === 'running' || timerState === 'paused') && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleStop}
            className="size-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/15 hover:border-red-500/25 transition-colors group"
            aria-label="Stop"
          >
            <Square className="size-4 text-muted-foreground group-hover:text-red-400 transition-colors" />
          </motion.button>
        )}
      </div>

      {/* Elapsed time */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Elapsed: {formatTime(totalElapsed)} / {formatTime(getTotalTime(activePoses))}
        </p>
      </div>
    </div>
  )
}
