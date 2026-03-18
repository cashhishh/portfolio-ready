'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { motion, useScroll, useTransform, type Variants } from 'framer-motion'
import { FiArrowDown, FiDownload } from 'react-icons/fi'

interface HeroProps {
  name: string
  title: string
  titles: string[]
  resumeURL?: string
}

export default function Hero({ name, title, titles, resumeURL }: HeroProps) {
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const rotatingTitles = useMemo(() => titles.length > 0 ? titles : [title], [titles, title])

  useEffect(() => {
    const current = rotatingTitles[currentTitleIndex]
    let timeout: NodeJS.Timeout

    if (!isDeleting) {
      if (displayText.length < current.length) {
        timeout = setTimeout(() => {
          setDisplayText(current.slice(0, displayText.length + 1))
        }, 80)
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2000)
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, 40)
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(false)
          setCurrentTitleIndex((prev) => (prev + 1) % rotatingTitles.length)
        }, 0)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentTitleIndex, rotatingTitles])

  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.04,
        duration: 0.5,
        ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number],
      },
    }),
  }

  return (
    <section ref={containerRef} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-125 h-64 sm:h-125 bg-purple-500/5 rounded-full blur-[100px] sm:blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-100 h-48 sm:h-100 bg-blue-500/5 rounded-full blur-[100px] sm:blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-150 h-72 sm:h-150 bg-indigo-500/3 rounded-full blur-[130px]" />

        {/* Grain overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />

        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-size-[64px_64px]" />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-6">
        {/* Overline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-white/30 text-sm tracking-[0.3em] uppercase mb-6"
        >
          Portfolio
        </motion.p>

        {/* Name - word by word with letter animation */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight mb-6 overflow-visible">
          {name.split(' ').map((word, wordIndex, wordsArr) => {
            const charOffset = wordsArr.slice(0, wordIndex).reduce((acc, w) => acc + w.length + 1, 0)
            return (
              <span key={wordIndex} className="inline-block whitespace-nowrap" style={{ marginRight: wordIndex < wordsArr.length - 1 ? '0.25em' : '0' }}>
                {word.split('').map((letter, letterIndex) => (
                  <motion.span
                    key={letterIndex}
                    custom={charOffset + letterIndex}
                    variants={letterVariants}
                    initial="hidden"
                    animate="visible"
                    className="inline-block bg-linear-to-b from-white to-white/60 bg-clip-text text-transparent"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            )
          })}
        </h1>

        {/* Rotating title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="h-10 flex items-center justify-center"
        >
          <span className="text-lg sm:text-xl md:text-2xl text-white/50 font-light">
            {displayText}
            <span className="animate-pulse ml-0.5 text-white/80">|</span>
          </span>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="flex items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-12 flex-wrap"
        >
          <button
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            data-cursor="View"
            className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-black text-sm sm:text-base font-medium rounded-full hover:bg-white/90 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            View My Work
          </button>
          {resumeURL && (
            <a
              href={resumeURL}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="Download"
              className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 border border-white/20 text-white text-sm sm:text-base rounded-full hover:bg-white/5 transition-all duration-300"
            >
              <FiDownload className="w-4 h-4" />
              Resume
            </a>
          )}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-white/20"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <FiArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  )
}
