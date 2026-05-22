'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Heart, Sparkles, CheckCircle2, Activity, Droplets, Moon, Timer, Leaf, Users, Target, Lightbulb, Shield } from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
}

const checklistItems = [
  'Comprehensive nutrition tracking with macro and micronutrients',
  'Extensive library of Indian yoga asanas with instructions',
  'Pranayama breathing exercises for stress relief',
  'Daily progress tracking and historical data',
  'Traditional Indian exercises for strength and flexibility',
  'AI-powered meal parsing for quick food logging',
  'Sleep tracking with Ayurvedic sleep recommendations',
  'Weekly meal planner with grocery lists',
]

const platformStats = [
  { label: 'Yoga Poses', value: 12, suffix: '+', icon: Activity, color: 'text-orange-400', bg: 'bg-orange-500/15' },
  { label: 'Indian Foods', value: 21, suffix: '', icon: Leaf, color: 'text-teal-400', bg: 'bg-teal-500/15' },
  { label: 'Wellness Tools', value: 6, suffix: '', icon: Timer, color: 'text-amber-400', bg: 'bg-amber-500/15' },
  { label: 'Dosha Profiles', value: 3, suffix: '', icon: Sparkles, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
]

const teamMembers = [
  { name: 'Dr. Priya Sharma', role: 'Ayurvedic Consultant', initials: 'PS', gradient: 'from-teal-400 to-emerald-500' },
  { name: 'Arjun Patel', role: 'Yoga & Fitness Lead', initials: 'AP', gradient: 'from-orange-400 to-amber-500' },
  { name: 'Meera Iyer', role: 'Nutrition Scientist', initials: 'MI', gradient: 'from-amber-400 to-yellow-500' },
  { name: 'Rohan Desai', role: 'Tech & AI Architect', initials: 'RD', gradient: 'from-emerald-400 to-teal-500' },
]

const values = [
  { icon: Target, title: 'Tradition Meets Tech', description: 'We honor centuries of Indian wellness wisdom while leveraging modern technology for accessibility.', color: 'text-teal-400', bg: 'bg-teal-500/15' },
  { icon: Lightbulb, title: 'Personalized Wellness', description: 'Every body is unique. Our Ayurvedic approach provides personalized recommendations for your constitution.', color: 'text-orange-400', bg: 'bg-orange-500/15' },
  { icon: Shield, title: 'Holistic Health', description: 'True wellness encompasses body, mind, and spirit. Our tools address all dimensions of health.', color: 'text-amber-400', bg: 'bg-amber-500/15' },
  { icon: Users, title: 'Community First', description: 'Built for India, by India. We understand the unique dietary and cultural needs of Indian wellness.', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
]

// ─── Animated Counter Component ─────────────────────────────────────────────

function AnimatedStat({ stat }: { stat: typeof platformStats[number] }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const hasStarted = useRef(false)

  useEffect(() => {
    if (!isInView || hasStarted.current) return
    hasStarted.current = true
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / 1000, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * stat.value))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [isInView, stat.value])

  const Icon = stat.icon
  return (
    <div ref={ref} className="stat-card flex flex-col items-center p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
      <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
        <Icon className={`w-6 h-6 ${stat.color}`} />
      </div>
      <span className={`text-3xl font-bold ${stat.color}`}>
        {count}{stat.suffix}
      </span>
      <span className="text-xs text-muted-foreground mt-1">{stat.label}</span>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] pt-24 pb-16">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="floating-orb w-[400px] h-[400px] top-20 -right-32"
          style={{ background: 'oklch(0.696 0.17 162.48 / 10%)', animationDelay: '-3s' }}
        />
        <div
          className="floating-orb w-[350px] h-[350px] bottom-20 -left-32"
          style={{ background: 'oklch(0.828 0.189 84.429 / 8%)', animationDelay: '-10s' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            About{' '}
            <span className="gradient-text-animated">FitLife India</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bridging ancient wisdom and modern wellness technology for a healthier India.
          </p>
        </motion.div>

        {/* Platform Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {platformStats.map((stat) => (
            <AnimatedStat key={stat.label} stat={stat} />
          ))}
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {/* Our Mission */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={0}
            className="glass-card-premium noise-overlay p-6 lg:p-8 group"
          >
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/15 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-7 h-7 text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                At FitLife India, our mission is to make traditional Indian wellness practices
                accessible to everyone. We believe that the centuries-old wisdom of Ayurveda,
                yoga, and Indian dietary science holds the key to sustainable health. Our
                platform combines this ancient knowledge with modern technology to create a
                personalized wellness experience that respects tradition while embracing
                innovation.
              </p>
              <div className="mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-teal-500 to-teal-400" />
            </div>
          </motion.div>

          {/* Why Indian Wellness? */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={1}
            className="glass-card-premium noise-overlay p-6 lg:p-8 group"
          >
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/15 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-7 h-7 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Why Indian Wellness?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Indian wellness traditions have been refined over thousands of years, creating
                a holistic approach to health that addresses the body, mind, and spirit as one.
                From the precise nutritional science of Ayurveda to the transformative power
                of yoga asanas, these practices have stood the test of time because they work.
                Our platform brings this rich heritage to your fingertips, making it easy to
                integrate these time-tested practices into your daily routine.
              </p>
              <div className="mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-orange-500 to-orange-400" />
            </div>
          </motion.div>

          {/* Our Features */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={2}
            className="glass-card-premium noise-overlay p-6 lg:p-8 group"
          >
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-5">Our Features</h3>
              <ul className="space-y-3">
                {checklistItems.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-sm leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-amber-400 to-amber-300" />
            </div>
          </motion.div>
        </div>

        {/* Our Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-3 heading-underline">
              Our Values
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mt-8">
              The principles that guide everything we build for your wellness journey.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((val, i) => {
              const Icon = val.icon
              return (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="glass-card p-5 group"
                >
                  <div className={`w-11 h-11 rounded-xl ${val.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-5 h-5 ${val.color}`} />
                  </div>
                  <h4 className="text-base font-semibold text-foreground mb-2">{val.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{val.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="leaf-pattern py-8"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-3 heading-underline">
              Meet Our Team
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mt-8">
              Experts in Ayurveda, yoga, nutrition, and technology working together for your wellness.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="glass-card p-6 text-center group"
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <span className="text-lg font-bold text-background">{member.initials}</span>
                </div>
                <h4 className="text-base font-semibold text-foreground mb-1">{member.name}</h4>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
