'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAuthChange: (user: { name: string; email: string; isGuest: boolean } | null) => void
}

export default function AuthModal({ open, onOpenChange, onAuthChange }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')
  const [signUpName, setSignUpName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    if (!signInEmail || !signInPassword) return
    setIsLoading(true)
    // Simulate auth delay
    await new Promise((r) => setTimeout(r, 800))
    onAuthChange({ name: signInEmail.split('@')[0], email: signInEmail, isGuest: false })
    setIsLoading(false)
    onOpenChange(false)
    resetForm()
  }

  const handleSignUp = async () => {
    if (!signUpName || !signUpEmail || !signUpPassword) return
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    onAuthChange({ name: signUpName, email: signUpEmail, isGuest: false })
    setIsLoading(false)
    onOpenChange(false)
    resetForm()
  }

  const handleGuest = () => {
    onAuthChange({ name: 'Guest', email: '', isGuest: true })
    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setSignInEmail('')
    setSignInPassword('')
    setSignUpName('')
    setSignUpEmail('')
    setSignUpPassword('')
    setActiveTab('signin')
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v) }}>
      <DialogContent
        showCloseButton={false}
        className="glass-strong max-w-md p-0 overflow-hidden border-border/50"
      >
        {/* Close Button */}
        <button
          onClick={() => { resetForm(); onOpenChange(false) }}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-foreground">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent">
                FitLife India
              </span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Sign in to track your wellness journey
            </DialogDescription>
          </DialogHeader>

          {/* Tab Buttons */}
          <div className="flex p-1 rounded-xl bg-white/[0.04] border border-white/[0.06] mb-6">
            <button
              onClick={() => setActiveTab('signin')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === 'signin'
                  ? 'bg-teal-500/15 text-teal-400 border border-teal-500/20'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === 'signup'
                  ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'signin' ? (
              <motion.div
                key="signin"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-foreground/80">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      className="pl-10 bg-white/[0.04] border-white/[0.08] focus-visible:border-teal-500/50 focus-visible:ring-teal-500/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-foreground/80">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="pl-10 bg-white/[0.04] border-white/[0.08] focus-visible:border-teal-500/50 focus-visible:ring-teal-500/20"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSignIn}
                  disabled={isLoading || !signInEmail || !signInPassword}
                  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-background font-semibold shadow-lg shadow-teal-500/25 border-0 group"
                >
                  {isLoading ? 'Signing in...' : 'Continue'}
                  {!isLoading && <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-foreground/80">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Your full name"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      className="pl-10 bg-white/[0.04] border-white/[0.08] focus-visible:border-orange-500/50 focus-visible:ring-orange-500/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-foreground/80">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      className="pl-10 bg-white/[0.04] border-white/[0.08] focus-visible:border-orange-500/50 focus-visible:ring-orange-500/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-foreground/80">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      className="pl-10 bg-white/[0.04] border-white/[0.08] focus-visible:border-orange-500/50 focus-visible:ring-orange-500/20"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSignUp}
                  disabled={isLoading || !signUpName || !signUpEmail || !signUpPassword}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-background font-semibold shadow-lg shadow-orange-500/25 border-0 group"
                >
                  {isLoading ? 'Creating account...' : 'Continue'}
                  {!isLoading && <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-background/80 text-muted-foreground">or continue with</span>
            </div>
          </div>

          {/* Guest Button */}
          <Button
            variant="outline"
            onClick={handleGuest}
            className="w-full border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-amber-500/30 text-foreground font-medium transition-all"
          >
            Continue as Guest
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
