'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { FiSend, FiCheck } from 'react-icons/fi'

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name: '', email: '', content: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const steps = [
    { key: 'name', label: "What's your name?", placeholder: 'John Doe' },
    { key: 'email', label: "What's your email?", placeholder: 'john@example.com' },
    { key: 'content', label: "What's on your mind?", placeholder: 'Tell me about your project...' },
  ]

  const chatMessages = [
    { from: 'bot', text: "Hi there! 👋 I'd love to hear from you." },
    { from: 'bot', text: "Got a project in mind, or just want to say hello?" },
    { from: 'bot', text: "Let's start a conversation." },
  ]

  async function handleSubmit() {
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSent(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to send message')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (step < 2) {
        const currentKey = steps[step].key as keyof typeof form
        if (form[currentKey].trim()) setStep(step + 1)
      } else if (form.content.trim()) {
        handleSubmit()
      }
    }
  }

  return (
    <section id="contact" className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6" ref={ref}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-white/30 text-sm tracking-[0.3em] uppercase mb-4">Contact</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 sm:mb-16">
            Let&apos;s talk<span className="text-white/20">.</span>
          </h2>
        </motion.div>

        {/* Chat UI */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-3xl bg-white/2 border border-white/6 overflow-hidden"
        >
          {/* Chat header */}
          <div className="px-4 sm:px-6 py-4 border-b border-white/6 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400/60 animate-pulse" />
            <span className="text-sm text-white/50">Available for new opportunities</span>
          </div>

          {/* Messages */}
          <div className="p-4 sm:p-6 space-y-4 min-h-50 sm:min-h-75">
            {/* Bot messages */}
            {chatMessages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.15 }}
                className="flex justify-start"
              >
                <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-bl-md bg-white/5 text-white/60 text-sm wrap-break-word">
                  {msg.text}
                </div>
              </motion.div>
            ))}

            {/* User responses as chat bubbles */}
            <AnimatePresence mode="popLayout">
              {form.name && step > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="flex justify-end"
                >
                  <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-br-md bg-white/10 text-white text-sm">
                    {form.name}
                  </div>
                </motion.div>
              )}
              {form.email && step > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="flex justify-end"
                >
                  <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-br-md bg-white/10 text-white text-sm">
                    {form.email}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success message */}
            <AnimatePresence>
              {sent && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-2 px-4 py-3 rounded-2xl rounded-bl-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                    <FiCheck className="w-4 h-4" />
                    Message received! I&apos;ll get back to you soon.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input area */}
          {!sent && (
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="text-xs text-white/30 mb-2 block">{steps[step].label}</label>
                  <div className="flex gap-3">
                    {step === 2 ? (
                      <textarea
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        onKeyDown={handleKeyDown}
                        placeholder={steps[step].placeholder}
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/8 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors resize-none h-24 text-sm"
                        autoFocus
                      />
                    ) : (
                      <input
                        type={step === 1 ? 'email' : 'text'}
                        value={form[steps[step].key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [steps[step].key]: e.target.value })}
                        onKeyDown={handleKeyDown}
                        placeholder={steps[step].placeholder}
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/8 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors text-sm"
                        autoFocus
                      />
                    )}
                    <button
                      onClick={() => {
                        const currentKey = steps[step].key as keyof typeof form
                        if (!form[currentKey].trim()) return
                        if (step < 2) setStep(step + 1)
                        else handleSubmit()
                      }}
                      disabled={sending}
                      className="px-4 py-3 bg-white text-black rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
                    >
                      {step < 2 ? 'Next' : sending ? 'Sending...' : <><FiSend className="w-4 h-4" /> Send</>}
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
              {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
