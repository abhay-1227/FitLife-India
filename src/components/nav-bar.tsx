'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, Coffee, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetDescription,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface NavBarProps {
  currentPage: string
  onPageChange: (page: string) => void
  onAuthOpen: () => void
}

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'yoga', label: 'Yoga & Exercise' },
  { id: 'about', label: 'About' },
]

const toolLinks = [
  { id: 'bmi', label: 'BMI Calculator', desc: 'South Asian thresholds' },
  { id: 'water', label: 'Water Tracker', desc: 'Daily hydration goal' },
  { id: 'sleep', label: 'Sleep Tracker', desc: 'Monitor your rest quality' },
  { id: 'meals', label: 'Meal Planner', desc: 'Plan your weekly meals' },
  { id: 'dosha', label: 'Dosha Quiz', desc: 'Ayurvedic constitution' },
  { id: 'yoga-timer', label: 'Yoga Timer', desc: 'Guided practice sessions' },
]

export default function NavBar({ currentPage, onPageChange, onAuthOpen }: NavBarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (page: string) => {
    onPageChange(page)
    setMobileOpen(false)
  }

  const isToolActive = toolLinks.some((t) => t.id === currentPage)

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-lg shadow-black/10'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-amber-400 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-shadow">
              <Coffee className="w-5 h-5 text-background" />
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight">
              FitLife{' '}
              <span className="bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent">
                India
              </span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  currentPage === link.id
                    ? 'text-teal-400'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {currentPage === link.id && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-teal-500/10 border border-teal-500/20 rounded-lg"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </button>
            ))}

            {/* Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
                    isToolActive
                      ? 'text-teal-400'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {isToolActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-teal-500/10 border border-teal-500/20 rounded-lg"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">Tools</span>
                  <ChevronDown className="relative z-10 h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className="bg-background/95 backdrop-blur-xl border-border w-56"
              >
                {toolLinks.map((tool) => (
                  <DropdownMenuItem
                    key={tool.id}
                    onClick={() => handleNavClick(tool.id)}
                    className={`cursor-pointer flex flex-col items-start gap-0.5 py-2.5 px-3 ${
                      currentPage === tool.id ? 'bg-teal-500/10 text-teal-400' : 'text-foreground'
                    }`}
                  >
                    <span className="text-sm font-medium">{tool.label}</span>
                    <span className="text-xs text-muted-foreground">{tool.desc}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onAuthOpen}
              className="text-muted-foreground hover:text-foreground"
            >
              Sign In
            </Button>
            <Button
              size="sm"
              onClick={onAuthOpen}
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-background font-semibold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all border-0"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </nav>
      </motion.header>

      {/* Mobile Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="bg-background/95 backdrop-blur-xl border-border w-72">
          <SheetHeader className="border-b border-border pb-4">
            <SheetTitle className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-amber-400 flex items-center justify-center">
                <Coffee className="w-4 h-4 text-background" />
              </div>
              <span className="text-foreground font-bold">
                FitLife{' '}
                <span className="bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent">
                  India
                </span>
              </span>
            </SheetTitle>
            <SheetDescription className="sr-only">
              Navigation menu for FitLife India
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-1 py-4">
            <p className="px-4 py-1 text-xs font-medium text-muted-foreground/50 uppercase tracking-wider">Pages</p>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  currentPage === link.id
                    ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}

            <p className="px-4 py-1 mt-3 text-xs font-medium text-muted-foreground/50 uppercase tracking-wider">Wellness Tools</p>
            {toolLinks.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleNavClick(tool.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  currentPage === tool.id
                    ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                <div className="flex flex-col">
                  <span>{tool.label}</span>
                  <span className="text-xs text-muted-foreground/50">{tool.desc}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-3 pt-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-center text-muted-foreground hover:text-foreground"
              onClick={() => {
                onAuthOpen()
                setMobileOpen(false)
              }}
            >
              Sign In
            </Button>
            <Button
              className="w-full justify-center bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-background font-semibold shadow-lg shadow-teal-500/25 border-0"
              onClick={() => {
                onAuthOpen()
                setMobileOpen(false)
              }}
            >
              Get Started
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
