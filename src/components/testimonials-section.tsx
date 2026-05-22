'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface Testimonial {
  id: number
  name: string
  role: string
  text: string
  rating: number
  initials: string
  accentColor: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Yoga Instructor, Rishikesh',
    text: 'FitLife India has transformed how I guide my students. The Ayurvedic food database is incredibly accurate for Indian meals, and the dosha quiz helped me understand my own constitution better. Highly recommended for anyone on a wellness journey!',
    rating: 5,
    initials: 'PS',
    accentColor: 'from-teal-500 to-emerald-600',
  },
  {
    id: 2,
    name: 'Arjun Patel',
    role: 'IT Professional, Bangalore',
    text: 'As someone with a sedentary job, the nutrition tracker was a game-changer. I logged my daily dal-roti-sabzi and realized I was missing protein. Within 3 months of using the app, I lost 8 kg and feel more energetic than ever!',
    rating: 5,
    initials: 'AP',
    accentColor: 'from-orange-500 to-amber-600',
  },
  {
    id: 3,
    name: 'Meera Krishnan',
    role: 'Homemaker, Chennai',
    text: 'The water tracker feature is so simple yet so effective! I never realized I was drinking only 4 glasses a day. Now I hit my 8-glass goal daily. The Indian food database covers everything from idli to dosa — it feels made for us.',
    rating: 4,
    initials: 'MK',
    accentColor: 'from-emerald-500 to-green-600',
  },
  {
    id: 4,
    name: 'Dr. Vikram Singh',
    role: 'Ayurvedic Physician, Jaipur',
    text: 'Finally, a wellness app that respects Indian dietary patterns! The dosha quiz is surprisingly accurate, and the food recommendations align well with Ayurvedic principles. I now recommend this app to my patients for daily tracking.',
    rating: 5,
    initials: 'VS',
    accentColor: 'from-amber-500 to-yellow-600',
  },
  {
    id: 5,
    name: 'Ananya Desai',
    role: 'College Student, Pune',
    text: 'The BMI calculator with South Asian thresholds was an eye-opener. I didn\'t know we have higher risk at lower BMI! The yoga section is beautiful — I practice Surya Namaskar every morning now. This app makes wellness accessible and fun.',
    rating: 4,
    initials: 'AD',
    accentColor: 'from-teal-400 to-cyan-600',
  },
  {
    id: 6,
    name: 'Rajesh Gupta',
    role: 'Business Owner, Delhi',
    text: 'I was skeptical about health apps, but FitLife India changed my mind. The AI meal parser understood "2 roti aur 1 bowl rajma" perfectly! My cholesterol levels have improved since I started tracking my nutrition here regularly.',
    rating: 5,
    initials: 'RG',
    accentColor: 'from-orange-400 to-red-600',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? 'text-amber-400 fill-amber-400'
              : 'text-white/10'
          }`}
        />
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const itemsPerView = typeof window !== 'undefined' && window.innerWidth >= 768 ? 2 : 1
  const maxIndex = TESTIMONIALS.length - itemsPerView

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }, [maxIndex])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }, [maxIndex])

  // Auto-scroll
  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(goToNext, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, goToNext])

  const handleManualNav = (direction: 'prev' | 'next') => {
    setIsAutoPlaying(false)
    if (direction === 'prev') goToPrev()
    else goToNext()
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-2"
      >
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent">
            What Our Users Say
          </span>
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Real stories from people who transformed their wellness journey
        </p>
      </motion.div>

      {/* Testimonials Carousel */}
      <div className="relative">
        {/* Cards Container */}
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{ x: `-${currentIndex * (100 / itemsPerView + 2)}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            {TESTIMONIALS.map((testimonial, i) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="shrink-0"
                style={{ width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 24 / itemsPerView}px)` }}
              >
                <div className="glass-card p-6 h-full flex flex-col">
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <Quote className="h-8 w-8 text-teal-400/30" />
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>

                  {/* Rating */}
                  <StarRating rating={testimonial.rating} />

                  {/* Author */}
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/[0.06]">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback
                        className={`bg-gradient-to-br ${testimonial.accentColor} text-background text-xs font-bold`}
                      >
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => handleManualNav('prev')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-teal-500/30 hover:bg-teal-500/10 transition-all z-10 hidden sm:flex"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => handleManualNav('next')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-teal-500/30 hover:bg-teal-500/10 transition-all z-10 hidden sm:flex"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIsAutoPlaying(false)
              setCurrentIndex(i)
              setTimeout(() => setIsAutoPlaying(true), 10000)
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? 'w-6 bg-teal-400'
                : 'w-2 bg-white/15 hover:bg-white/25'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Mobile Navigation */}
      <div className="flex items-center justify-center gap-3 sm:hidden">
        <button
          onClick={() => handleManualNav('prev')}
          className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-teal-500/30 transition-all"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-xs text-muted-foreground">
          {currentIndex + 1} / {maxIndex + 1}
        </span>
        <button
          onClick={() => handleManualNav('next')}
          className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-teal-500/30 transition-all"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
