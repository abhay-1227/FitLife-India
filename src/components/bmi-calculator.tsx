'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Ruler,
  Weight,
  Calendar,
  RotateCcw,
  Heart,
  AlertTriangle,
  CheckCircle2,
  Info,
  Activity,
} from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'

// South Asian BMI categories (adjusted thresholds)
const BMI_CATEGORIES = [
  { max: 18.5, label: 'Underweight', color: '#60a5fa', gradient: 'from-blue-400 to-blue-600' },
  { max: 22.9, label: 'Normal', color: '#34d399', gradient: 'from-emerald-400 to-green-500' },
  { max: 27.4, label: 'Overweight', color: '#fbbf24', gradient: 'from-amber-400 to-yellow-500' },
  { max: Infinity, label: 'Obese', color: '#f87171', gradient: 'from-red-400 to-red-600' },
]

const HEALTH_TIPS: Record<string, { icon: React.ElementType; tips: string[] }> = {
  Underweight: {
    icon: AlertTriangle,
    tips: [
      'Include calorie-dense Indian foods like ghee, paneer, and dry fruits in your diet',
      'Eat frequent small meals — 5-6 meals per day with snacks like lassi and banana shakes',
      'Add protein-rich dal, rajma, and chole to increase muscle mass',
      'Practice strength-building yoga like Surya Namaskar and Danda Bethak',
      'Consult an Ayurvedic practitioner about Ashwagandha for healthy weight gain',
    ],
  },
  Normal: {
    icon: CheckCircle2,
    tips: [
      'Maintain your balanced diet with roti, dal, sabzi, and curd in proper portions',
      'Continue regular yoga and pranayama practice for sustained wellness',
      'Include seasonal fruits and vegetables as per Ayurvedic principles',
      'Stay hydrated with 2-3 liters of water and herbal teas like tulsi chai',
      'Maintain a consistent meal schedule — avoid skipping breakfast',
    ],
  },
  Overweight: {
    icon: Info,
    tips: [
      'South Asians face health risks at lower BMI — start mindful eating today',
      'Replace white rice with brown rice and roti with multigrain roti',
      'Practice Kapalbhati pranayama — it boosts metabolism naturally',
      'Walk 30 minutes daily, ideally in the morning (morning walk or "prabhat pheri")',
      'Reduce sugar in chai and switch to jaggery (gur) in moderation',
    ],
  },
  Obese: {
    icon: Heart,
    tips: [
      'South Asians have higher diabetes and heart disease risk — consult a doctor soon',
      'Follow a low-glycemic Indian diet: moong dal, bitter gourd, and methi seeds',
      'Start with gentle yoga — Tadasana, Padmasana, and Anulom Vilom',
      'Avoid fried foods (pakoras, samosas) and replace with roasted snacks',
      'Consider intermittent fasting (a form of "Ekadashi" fasting) under medical guidance',
    ],
  },
}

const RISK_NOTE =
  'Note: For South Asians, health risks like diabetes and heart disease begin at a lower BMI (≥23) compared to other populations. These thresholds are adjusted for Indian body composition.'

function getBMICategory(bmi: number) {
  return BMI_CATEGORIES.find((c) => bmi < c.max) || BMI_CATEGORIES[BMI_CATEGORIES.length - 1]
}

function calculateBMI(heightCm: number, weightKg: number): number {
  const heightM = heightCm / 100
  if (heightM <= 0) return 0
  return weightKg / (heightM * heightM)
}

export default function BMICalculator() {
  const [height, setHeight] = useState(165)
  const [weight, setWeight] = useState(65)
  const [age, setAge] = useState(30)
  const [gender, setGender] = useState<'male' | 'female'>('male')

  const bmi = useMemo(() => calculateBMI(height, weight), [height, weight])
  const category = useMemo(() => getBMICategory(bmi), [bmi])
  const tips = useMemo(() => HEALTH_TIPS[category.label], [category])

  // BMI gauge calculation (range 10-40 mapped to 0-180 degrees)
  const gaugeMin = 10
  const gaugeMax = 40
  const clampedBMI = Math.max(gaugeMin, Math.min(gaugeMax, bmi))
  const gaugeAngle = ((clampedBMI - gaugeMin) / (gaugeMax - gaugeMin)) * 180

  const handleReset = () => {
    setHeight(165)
    setWeight(65)
    setAge(30)
    setGender('male')
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
          <Activity className="h-6 w-6 text-teal-400" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent">
              BMI Calculator
            </span>
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Calculate your Body Mass Index with South Asian health thresholds
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — Input Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-6 space-y-6"
        >
          {/* Height Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Ruler className="h-4 w-4 text-teal-400" />
                Height
              </label>
              <span className="text-sm font-bold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full">
                {height} cm
              </span>
            </div>
            <Slider
              value={[height]}
              onValueChange={(v) => setHeight(v[0])}
              min={100}
              max={220}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>100 cm</span>
              <span>220 cm</span>
            </div>
          </div>

          {/* Weight Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Weight className="h-4 w-4 text-orange-400" />
                Weight
              </label>
              <span className="text-sm font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full">
                {weight} kg
              </span>
            </div>
            <Slider
              value={[weight]}
              onValueChange={(v) => setWeight(v[0])}
              min={30}
              max={180}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>30 kg</span>
              <span>180 kg</span>
            </div>
          </div>

          {/* Age Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Calendar className="h-4 w-4 text-amber-400" />
                Age
              </label>
              <span className="text-sm font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full">
                {age} years
              </span>
            </div>
            <Slider
              value={[age]}
              onValueChange={(v) => setAge(v[0])}
              min={10}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>10</span>
              <span>100</span>
            </div>
          </div>

          {/* Gender Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Heart className="h-4 w-4 text-pink-400" />
              Gender
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setGender('male')}
                className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                  gender === 'male'
                    ? 'bg-teal-500/15 border-teal-500/30 text-teal-400'
                    : 'bg-white/3 border-white/10 text-muted-foreground hover:bg-white/6'
                }`}
              >
                Male
              </button>
              <button
                onClick={() => setGender('female')}
                className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                  gender === 'female'
                    ? 'bg-orange-500/15 border-orange-500/30 text-orange-400'
                    : 'bg-white/3 border-white/10 text-muted-foreground hover:bg-white/6'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          {/* Reset Button */}
          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full border-white/10 hover:border-teal-500/30 hover:bg-teal-500/10 hover:text-teal-400 transition-all"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </motion.div>

        {/* Right — Results */}
        <div className="space-y-6">
          {/* BMI Gauge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Your BMI</h3>

            {/* SVG Gauge */}
            <div className="flex justify-center py-2">
              <svg width="280" height="160" viewBox="0 0 280 160">
                <defs>
                  <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="33%" stopColor="#34d399" />
                    <stop offset="66%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f87171" />
                  </linearGradient>
                </defs>

                {/* Background arc */}
                <path
                  d="M 30 140 A 110 110 0 0 1 250 140"
                  fill="none"
                  stroke="oklch(1 0 0 / 8%)"
                  strokeWidth="16"
                  strokeLinecap="round"
                />

                {/* Colored arc */}
                <path
                  d="M 30 140 A 110 110 0 0 1 250 140"
                  fill="none"
                  stroke="url(#gaugeGrad)"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray={Math.PI * 110}
                  strokeDashoffset={0}
                />

                {/* Category markers */}
                {/* Underweight: 10-18.5 → 0-28.3% */}
                <line x1="30" y1="140" x2="30" y2="130" stroke="oklch(1 0 0 / 30%)" strokeWidth="1" />
                <text x="28" y="155" textAnchor="middle" fill="oklch(0.65 0.03 155)" fontSize="8">10</text>

                {/* Normal end: 22.9 → 43% */}
                <text x="92" y="155" textAnchor="middle" fill="oklch(0.65 0.03 155)" fontSize="8">18.5</text>

                {/* Overweight end: 27.4 → 58% */}
                <text x="140" y="155" textAnchor="middle" fill="oklch(0.65 0.03 155)" fontSize="8">23</text>

                {/* Obese start: 27.5 → 58.3% */}
                <text x="189" y="155" textAnchor="middle" fill="oklch(0.65 0.03 155)" fontSize="8">27.5</text>

                <text x="250" y="155" textAnchor="middle" fill="oklch(0.65 0.03 155)" fontSize="8">40</text>

                {/* Needle */}
                <motion.g
                  initial={{ rotate: 0 }}
                  animate={{ rotate: gaugeAngle }}
                  transition={{ type: 'spring', stiffness: 60, damping: 15 }}
                  style={{ originX: '140px', originY: '140px' }}
                >
                  <line
                    x1="140"
                    y1="140"
                    x2="140"
                    y2="45"
                    stroke={category.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="140" cy="140" r="6" fill={category.color} />
                  <circle cx="140" cy="140" r="3" fill="oklch(0.14 0.025 155)" />
                </motion.g>

                {/* BMI Value */}
                <text
                  x="140"
                  y="120"
                  textAnchor="middle"
                  fill={category.color}
                  fontSize="28"
                  fontWeight="700"
                >
                  {bmi.toFixed(1)}
                </text>
              </svg>
            </div>

            {/* Category Label */}
            <AnimatePresence mode="wait">
              <motion.div
                key={category.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="text-center mt-2"
              >
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${category.gradient} text-background text-sm font-bold`}
                >
                  {category.label}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* South Asian Risk Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/15"
            >
              <p className="text-xs text-amber-400/80 leading-relaxed flex gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                {RISK_NOTE}
              </p>
            </motion.div>
          </motion.div>

          {/* Health Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <tips.icon className="h-5 w-5 text-teal-400" />
              <h3 className="text-lg font-semibold text-foreground">
                Health Tips for {category.label}
              </h3>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={category.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {tips.tips.map((tip, i) => (
                  <motion.div
                    key={tip}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
                  >
                    <span className="shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20 flex items-center justify-center text-xs font-bold text-teal-400">
                      {i + 1}
                    </span>
                    <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
