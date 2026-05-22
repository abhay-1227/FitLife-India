'use client'

import { Coffee, Heart, Github, Twitter, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[oklch(0.08_0.015_155)]">
      {/* Wave separator */}
      <div className="w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 60V20C240 60 480 0 720 20C960 40 1200 0 1440 20V60H0Z" fill="oklch(0.08 0.015 155)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-amber-400 flex items-center justify-center">
                <Coffee className="w-5 h-5 text-[oklch(0.1_0.02_155)]" />
              </div>
              <span className="text-lg font-bold text-foreground">FitLife India</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering millions to achieve their health goals through traditional Indian wellness practices and modern nutrition science.
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Features</h4>
            <div className="flex flex-col gap-2.5">
              <span className="text-sm text-muted-foreground hover:text-teal-400 transition-colors cursor-pointer">Nutrition Tracker</span>
              <span className="text-sm text-muted-foreground hover:text-teal-400 transition-colors cursor-pointer">Yoga Library</span>
              <span className="text-sm text-muted-foreground hover:text-teal-400 transition-colors cursor-pointer">Progress Reports</span>
              <span className="text-sm text-muted-foreground hover:text-teal-400 transition-colors cursor-pointer">AI Meal Parser</span>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Company</h4>
            <div className="flex flex-col gap-2.5">
              <span className="text-sm text-muted-foreground hover:text-teal-400 transition-colors cursor-pointer">About Us</span>
              <span className="text-sm text-muted-foreground hover:text-teal-400 transition-colors cursor-pointer">Careers</span>
              <span className="text-sm text-muted-foreground hover:text-teal-400 transition-colors cursor-pointer">Contact</span>
              <span className="text-sm text-muted-foreground hover:text-teal-400 transition-colors cursor-pointer">Blog</span>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Legal</h4>
            <div className="flex flex-col gap-2.5">
              <span className="text-sm text-muted-foreground hover:text-teal-400 transition-colors cursor-pointer">Privacy Policy</span>
              <span className="text-sm text-muted-foreground hover:text-teal-400 transition-colors cursor-pointer">Terms of Service</span>
              <span className="text-sm text-muted-foreground hover:text-teal-400 transition-colors cursor-pointer">Cookie Policy</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              <span className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-teal-400 hover:bg-teal-400/10 transition-all cursor-pointer">
                <Twitter className="w-4 h-4" />
              </span>
              <span className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-teal-400 hover:bg-teal-400/10 transition-all cursor-pointer">
                <Instagram className="w-4 h-4" />
              </span>
              <span className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-teal-400 hover:bg-teal-400/10 transition-all cursor-pointer">
                <Github className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FitLife India. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for Indian Wellness
          </p>
        </div>
      </div>
    </footer>
  )
}
