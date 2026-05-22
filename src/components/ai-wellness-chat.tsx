'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Namaste! I'm your AI wellness assistant. Ask me about nutrition, yoga poses, or traditional Indian wellness practices!",
}

export default function AIWellnessChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Focus input when sheet opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      })

      if (!res.ok) throw new Error('Failed to get response')

      const data = await res.json()

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.message,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "I'm having trouble connecting. Please try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl shadow-teal-500/30 transition-all duration-300 hover:scale-110 hover:shadow-teal-500/50 ${
          open ? 'opacity-0 pointer-events-none scale-75' : 'opacity-100 scale-100'
        }`}
        style={{
          background: 'linear-gradient(135deg, oklch(0.696 0.17 162.48), oklch(0.596 0.145 163.22))',
        }}
        aria-label="Open wellness chat"
      >
        <MessageSquare className="w-6 h-6 text-background" />
        {/* Pulse glow ring when closed */}
        {!open && (
          <span className="absolute inset-0 rounded-full pulse-glow" />
        )}
      </button>

      {/* Chat Sheet Panel */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="glass-strong !rounded-t-3xl !border-t !border-teal-500/20 h-[85vh] max-h-[700px] sm:max-w-lg sm:ml-auto sm:mr-4 p-0 flex flex-col"
        >
          {/* Header */}
          <SheetHeader className="p-5 pb-3 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20"
                  style={{
                    background: 'linear-gradient(135deg, oklch(0.696 0.17 162.48), oklch(0.596 0.145 163.22))',
                  }}
                >
                  <MessageSquare className="w-4 h-4 text-background" />
                </div>
                <span
                  className="text-lg font-bold"
                  style={{
                    background: 'linear-gradient(to right, oklch(0.765 0.163 178.5), oklch(0.828 0.189 84.429))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Wellness Assistant
                </span>
              </SheetTitle>
              <Badge
                variant="outline"
                className="text-[10px] px-2 py-0.5 border-teal-500/30 text-teal-400 bg-teal-500/10"
              >
                Powered by AI
              </Badge>
            </div>
            <SheetDescription className="sr-only">
              AI wellness chat assistant for nutrition, yoga, and Indian wellness practices
            </SheetDescription>
          </SheetHeader>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96" style={{ maxHeight: 'calc(85vh - 180px)' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'rounded-2xl rounded-br-md text-background'
                      : 'rounded-2xl rounded-bl-md text-foreground border border-teal-500/20'
                  }`}
                  style={
                    msg.role === 'user'
                      ? {
                          background:
                            'linear-gradient(135deg, oklch(0.696 0.17 162.48), oklch(0.596 0.145 163.22))',
                        }
                      : {
                          background:
                            'linear-gradient(135deg, oklch(1 0 0 / 8%) 0%, oklch(1 0 0 / 4%) 100%)',
                          backdropFilter: 'blur(20px)',
                        }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div
                  className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-md border border-teal-500/20"
                  style={{
                    background:
                      'linear-gradient(135deg, oklch(1 0 0 / 8%) 0%, oklch(1 0 0 / 4%) 100%)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <span
                    className="typing-dot w-2 h-2 rounded-full"
                    style={{ background: 'oklch(0.696 0.17 162.48)' }}
                  />
                  <span
                    className="typing-dot w-2 h-2 rounded-full"
                    style={{ background: 'oklch(0.696 0.17 162.48)' }}
                  />
                  <span
                    className="typing-dot w-2 h-2 rounded-full"
                    style={{ background: 'oklch(0.696 0.17 162.48)' }}
                  />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 pt-2 border-t border-white/10 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about nutrition, yoga, wellness..."
                disabled={isLoading}
                className="flex-1 h-11 rounded-xl border-white/10 bg-white/5 text-foreground placeholder:text-muted-foreground focus-visible:border-teal-500/50 focus-visible:ring-teal-500/20"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                size="icon"
                className="h-11 w-11 rounded-xl flex-shrink-0 border-0 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all"
                style={{
                  background: input.trim()
                    ? 'linear-gradient(135deg, oklch(0.696 0.17 162.48), oklch(0.596 0.145 163.22))'
                    : undefined,
                }}
              >
                <Send className="w-4 h-4 text-background" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
