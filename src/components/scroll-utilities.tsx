'use client'

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export default function ScrollUtilities() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight

      // Update scroll progress
      if (docHeight > 0) {
        const progress = (scrollTop / docHeight) * 100
        setScrollProgress(Math.min(progress, 100))
      }

      // Show back-to-top after 300px
      setShowBackToTop(scrollTop > 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Call once on mount to set initial state
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Scroll Progress Bar */}
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Page scroll progress"
      />

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        aria-label="Scroll to top"
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl shadow-teal-500/20 transition-all duration-300 hover:shadow-teal-500/40 hover:scale-110"
          style={{
            background: 'oklch(1 0 0 / 12%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid oklch(0.696 0.17 162.48 / 30%)',
          }}
        >
          <ArrowUp
            className="w-5 h-5"
            style={{ color: 'oklch(0.696 0.17 162.48)' }}
          />
        </div>
      </button>
    </>
  )
}
