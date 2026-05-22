'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import NavBar from '@/components/nav-bar'
import HomePage from '@/components/home-page'
import NutritionPage from '@/components/nutrition-page'
import YogaPage from '@/components/yoga-page'
import AboutPage from '@/components/about-page'
import BMICalculator from '@/components/bmi-calculator'
import WaterTracker from '@/components/water-tracker'
import DoshaQuiz from '@/components/dosha-quiz'
import MealPlanner from '@/components/meal-planner'
import SleepTracker from '@/components/sleep-tracker'
import YogaTimer from '@/components/yoga-timer'
import AuthModal from '@/components/auth-modal'
import Footer from '@/components/footer'
import ScrollUtilities from '@/components/scroll-utilities'
import AIWellnessChat from '@/components/ai-wellness-chat'

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home')
  const [authOpen, setAuthOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string; isGuest: boolean } | null>(null)
  const [seeded, setSeeded] = useState(false)

  // Seed database on first load
  useEffect(() => {
    if (!seeded) {
      fetch('/api/seed', { method: 'POST' })
        .then(res => res.json())
        .then(() => setSeeded(true))
        .catch(() => setSeeded(true))
    }
  }, [seeded])

  const handlePageChange = (page: string) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAuthChange = (newUser: { name: string; email: string; isGuest: boolean } | null) => {
    setUser(newUser)
    if (newUser) {
      setAuthOpen(false)
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'nutrition':
        return <NutritionPage />
      case 'yoga':
        return <YogaPage />
      case 'about':
        return <AboutPage />
      case 'bmi':
        return (
          <div className="min-h-screen p-4 md:p-6 lg:p-8">
            <BMICalculator />
          </div>
        )
      case 'water':
        return (
          <div className="min-h-screen p-4 md:p-6 lg:p-8">
            <WaterTracker />
          </div>
        )
      case 'dosha':
        return (
          <div className="min-h-screen p-4 md:p-6 lg:p-8">
            <DoshaQuiz />
          </div>
        )
      case 'sleep':
        return (
          <div className="min-h-screen p-4 md:p-6 lg:p-8">
            <SleepTracker />
          </div>
        )
      case 'yoga-timer':
        return (
          <div className="min-h-screen p-4 md:p-6 lg:p-8">
            <YogaTimer />
          </div>
        )
      case 'meals':
        return (
          <div className="min-h-screen p-4 md:p-6 lg:p-8">
            <MealPlanner />
          </div>
        )
      default:
        return <HomePage onNavigate={handlePageChange} />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Animated Background */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 20% 20%, oklch(0.696 0.17 162.48 / 6%) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 80%, oklch(0.705 0.213 47 / 5%) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, oklch(0.828 0.189 84.429 / 3%) 0%, transparent 60%),
              oklch(0.1 0.02 155)
            `
          }}
        />
        <div className="floating-orb" style={{ width: 400, height: 400, background: 'oklch(0.696 0.17 162.48 / 12%)', top: '10%', left: '10%' }} />
        <div className="floating-orb" style={{ width: 300, height: 300, background: 'oklch(0.705 0.213 47 / 10%)', top: '60%', right: '10%', animationDelay: '-7s' }} />
        <div className="floating-orb" style={{ width: 250, height: 250, background: 'oklch(0.828 0.189 84.429 / 8%)', bottom: '20%', left: '30%', animationDelay: '-14s' }} />
      </div>

      {/* Navigation */}
      <NavBar
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onAuthOpen={() => setAuthOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 pt-[72px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onAuthChange={handleAuthChange}
      />

      {/* Scroll Utilities */}
      <ScrollUtilities />

      {/* AI Wellness Chat */}
      <AIWellnessChat />
    </div>
  )
}
