'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Coffee, Clock, BarChart3, ArrowRight, Flame, Beef, Wheat, Droplets, Activity, GlassWater, Sparkles, Star, Moon, Utensils, Timer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import TestimonialsSection from '@/components/testimonials-section'

interface HomePageProps {
  onNavigate: (page: string) => void
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
}

const statsConfig = [
  { label: 'Calories', value: 1450, color: 'text-teal-400', icon: Flame, bg: 'bg-teal-500/15' },
  { label: 'Protein', value: 82, color: 'text-orange-400', icon: Beef, bg: 'bg-orange-500/15', suffix: 'g' },
  { label: 'Carbs', value: 180, color: 'text-amber-400', icon: Wheat, bg: 'bg-amber-500/15', suffix: 'g' },
  { label: 'Fats', value: 45, color: 'text-foreground/80', icon: Droplets, bg: 'bg-white/10', suffix: 'g' },
]

const features = [
  {
    icon: Coffee,
    title: 'Smart Nutrition Tracking',
    description: 'Log your meals with AI-powered parsing. Track macros, micros, and calories with traditional Indian food database.',
    gradient: 'from-teal-500 to-teal-600',
    shadow: 'shadow-teal-500/25',
    dots: ['AI-powered', '21 Indian foods', 'Macro tracking'],
  },
  {
    icon: Clock,
    title: 'Authentic Indian Yoga',
    description: 'Access a comprehensive library of yoga asanas, pranayama techniques, and traditional Indian exercises for all levels.',
    gradient: 'from-orange-500 to-orange-600',
    shadow: 'shadow-orange-500/25',
    dots: ['12+ poses', 'Pranayama', 'All levels'],
  },
  {
    icon: BarChart3,
    title: 'Progress Analytics',
    description: 'Visualize your wellness journey with detailed charts, streaks, and personalized insights based on Indian dietary patterns.',
    gradient: 'from-amber-400 to-amber-500',
    shadow: 'shadow-amber-500/25',
    dots: ['Weekly charts', 'Streak tracking', 'Smart insights'],
  },
]

const quickTools = [
  {
    id: 'bmi',
    icon: Activity,
    title: 'BMI Calculator',
    description: 'South Asian-adjusted health assessment',
    gradient: 'from-teal-500/20 to-emerald-500/10',
    accent: 'text-teal-400',
    border: 'border-teal-500/15 hover:border-teal-500/30',
  },
  {
    id: 'water',
    icon: GlassWater,
    title: 'Water Tracker',
    description: 'Track daily hydration & stay healthy',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/15 hover:border-emerald-500/30',
  },
  {
    id: 'sleep',
    icon: Moon,
    title: 'Sleep Tracker',
    description: 'Monitor your rest & sleep quality',
    gradient: 'from-violet-500/20 to-purple-500/10',
    accent: 'text-violet-400',
    border: 'border-violet-500/15 hover:border-violet-500/30',
  },
  {
    id: 'meals',
    icon: Utensils,
    title: 'Meal Planner',
    description: 'Plan balanced Indian meals weekly',
    gradient: 'from-amber-500/20 to-yellow-500/10',
    accent: 'text-amber-400',
    border: 'border-amber-500/15 hover:border-amber-500/30',
  },
  {
    id: 'dosha',
    icon: Sparkles,
    title: 'Dosha Quiz',
    description: 'Discover your Ayurvedic constitution',
    gradient: 'from-orange-500/20 to-amber-500/10',
    accent: 'text-orange-400',
    border: 'border-orange-500/15 hover:border-orange-500/30',
  },
  {
    id: 'yoga-timer',
    icon: Timer,
    title: 'Yoga Timer',
    description: 'Guided practice with session presets',
    gradient: 'from-rose-500/20 to-orange-500/10',
    accent: 'text-rose-400',
    border: 'border-rose-500/15 hover:border-rose-500/30',
  },
]

// ─── Animated Counter Component (separate to respect hook rules) ─────────────

function AnimatedNumber({ target, duration = 1200, className, suffix = '' }: { target: number; duration?: number; className?: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const hasStarted = useRef(false)

  useEffect(() => {
    if (!isInView) return
    if (hasStarted.current) return
    hasStarted.current = true

    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  }, [isInView, target, duration])

  return <span ref={ref} className={className}>{count}{suffix}</span>
}

// ─── Stat Item Component ────────────────────────────────────────────────────

function StatItem({ stat }: { stat: typeof statsConfig[number] }) {
  const Icon = stat.icon
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors">
      <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
        <Icon className={`w-4 h-4 ${stat.color}`} />
      </div>
      <div className="min-w-0">
        <p className={`text-sm font-semibold ${stat.color}`}>
          <AnimatedNumber target={stat.value} duration={1000} suffix={stat.suffix || ''} />
        </p>
        <p className="text-[11px] text-muted-foreground truncate">{stat.label}</p>
      </div>
    </div>
  )
}

// ─── Sparkle Particles Component ────────────────────────────────────────────

function SparkleParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${10 + Math.random() * 80}%`,
    top: `${10 + Math.random() * 60}%`,
    delay: `${Math.random() * 4}s`,
    duration: `${2.5 + Math.random() * 2}s`,
    size: `${3 + Math.random() * 4}px`,
    opacity: 0.3 + Math.random() * 0.5,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="sparkle absolute rounded-full bg-gradient-to-r from-teal-400 to-amber-400"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="relative">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="floating-orb w-[500px] h-[500px] -top-48 -left-48"
          style={{
            background: 'oklch(0.696 0.17 162.48 / 15%)',
            animationDelay: '0s',
          }}
        />
        <div
          className="floating-orb w-[400px] h-[400px] top-1/3 -right-32"
          style={{
            background: 'oklch(0.705 0.213 47 / 12%)',
            animationDelay: '-7s',
          }}
        />
        <div
          className="floating-orb w-[350px] h-[350px] -bottom-32 left-1/4"
          style={{
            background: 'oklch(0.828 0.189 84.429 / 10%)',
            animationDelay: '-14s',
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center pt-20 pb-16">
        {/* Sparkle particles around hero */}
        <SparkleParticles />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Text Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={fadeInUp} custom={0} className="space-y-4">
                <p className="text-sm font-medium text-teal-400 tracking-wider uppercase">
                  Your Wellness Journey Starts Here
                </p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                  Transform Your Life with{' '}
                  <span className="gradient-text-animated">
                    Ancient Indian Wellness
                  </span>
                </h1>
              </motion.div>

              <motion.p variants={fadeInUp} custom={1} className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                Combine the wisdom of Ayurveda and traditional Indian nutrition with modern tracking technology.
                Monitor your meals, practice yoga, and achieve holistic well-being — all in one place.
              </motion.p>

              <motion.div variants={fadeInUp} custom={2} className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={() => onNavigate('nutrition')}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-background font-semibold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all group border-0"
                >
                  Track Nutrition
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate('yoga')}
                  className="border-border hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-400 transition-all group"
                >
                  Explore Yoga
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>

              {/* Social Proof Badge */}
              <motion.div
                variants={fadeInUp}
                custom={3}
                className="flex items-center gap-3 pt-2"
              >
                <div className="flex -space-x-2">
                  {[
                    'bg-gradient-to-br from-teal-400 to-teal-600',
                    'bg-gradient-to-br from-orange-400 to-orange-600',
                    'bg-gradient-to-br from-amber-400 to-amber-600',
                    'bg-gradient-to-br from-emerald-400 to-emerald-600',
                  ].map((bg, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center text-[10px] font-bold text-background border-2 border-background`}
                    >
                      {['A', 'R', 'P', 'S'][i]}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3 h-3 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Trusted by <span className="text-teal-400 font-semibold">10,000+</span> users
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right - Daily Progress Card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex justify-center lg:justify-end"
            >
              <div className="glass-card-premium noise-overlay p-6 sm:p-8 w-full max-w-md">
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Daily Progress</h3>
                    <span className="text-xs text-muted-foreground bg-white/5 px-3 py-1 rounded-full">
                      Today
                    </span>
                  </div>

                  {/* Main Calorie Circle */}
                  <div className="flex items-center justify-center py-4">
                    <div className="relative w-40 h-40 ring-glow rounded-full">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          fill="none"
                          stroke="oklch(1 0 0 / 8%)"
                          strokeWidth="10"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          fill="none"
                          stroke="oklch(0.696 0.17 162.48)"
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 70}`}
                          strokeDashoffset={`${2 * Math.PI * 70 * (1 - 0.725)}`}
                          className="calorie-ring-animate"
                          style={{ filter: 'drop-shadow(0 0 8px oklch(0.696 0.17 162.48 / 40%))' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-foreground">
                          <AnimatedNumber target={72} duration={1500} suffix="%" />
                        </span>
                        <span className="text-xs text-muted-foreground">of daily goal</span>
                      </div>
                    </div>
                  </div>

                  {/* Macro Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {statsConfig.map((stat) => (
                      <StatItem key={stat.label} stat={stat} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 lg:py-28 dot-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 heading-underline">
              Why Choose FitLife India?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-8">
              We blend the timeless wisdom of Indian wellness traditions with cutting-edge technology
              to help you achieve your health goals.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: i * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="glass-card-premium noise-overlay p-6 lg:p-8 group"
                >
                  <div className="relative z-10">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg ${feature.shadow} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-7 h-7 text-background" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    {/* Animated dots */}
                    <div className="flex flex-wrap gap-2">
                      {feature.dots.map((dot, di) => (
                        <motion.span
                          key={dot}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + di * 0.1, duration: 0.3 }}
                          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-white/5 border border-white/8 rounded-full px-2.5 py-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                          {dot}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Quick Tools Section */}
      <section className="relative py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 heading-underline">
              Wellness Tools
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-8">
              Powerful tools designed specifically for Indian wellness — from Ayurvedic assessments to
              daily health tracking.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {quickTools.map((tool, i) => {
              const Icon = tool.icon
              return (
                <motion.button
                  key={tool.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: i * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => onNavigate(tool.id)}
                  className={`glass-card gradient-border-hover p-6 lg:p-8 group text-left bg-gradient-to-br ${tool.gradient} border ${tool.border} transition-all duration-300 cursor-pointer`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${tool.accent}`} />
                    </div>
                    <ArrowRight className={`w-5 h-5 ${tool.accent} opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ml-auto`} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-teal-300 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                </motion.button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TestimonialsSection />
        </div>
      </section>
    </div>
  )
}
