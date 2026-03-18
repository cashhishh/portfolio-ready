'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

interface ExperienceItem {
  id: string
  company: string
  role: string
  startDate: string
  endDate?: string | null
  description: string
  companyLogo?: string | null
}

interface ExperienceProps {
  experiences: ExperienceItem[]
}

export default function Experience({ experiences }: ExperienceProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const lineRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ['start 0.8', 'end 0.2'],
  })
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section id="experience" className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-white/30 text-sm tracking-[0.3em] uppercase mb-4">Experience</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 sm:mb-16">
            Where I&apos;ve worked<span className="text-white/20">.</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative" ref={lineRef}>
          {/* Animated line */}
          <div className="absolute left-3 sm:left-4.75 top-0 bottom-0 w-px bg-white/6">
            <motion.div
              className="w-full bg-linear-to-b from-white/40 to-white/10 origin-top"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <TimelineItem key={exp.id} experience={exp} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TimelineItem({ experience, index }: { experience: ExperienceItem; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
      className="relative pl-8 sm:pl-12"
    >
      {/* Timeline dot */}
      <div className="absolute left-1.5 sm:left-3 top-2 w-3.75 h-3.75 rounded-full border-2 border-white/20 bg-background">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
          className="absolute inset-1 rounded-full bg-white/40"
        />
      </div>

      <div className="p-4 sm:p-6 rounded-2xl bg-white/2 border border-white/6 hover:border-white/10 transition-all duration-300 group">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-white transition-colors wrap-break-word">{experience.role}</h3>
            <p className="text-white/50 text-sm wrap-break-word">{experience.company}</p>
          </div>
          <span className="text-xs text-white/30 mt-1 sm:mt-0 font-mono">
            {experience.startDate} — {experience.endDate || 'Present'}
          </span>
        </div>
        <p className="text-white/40 text-sm leading-relaxed">{experience.description}</p>
      </div>
    </motion.div>
  )
}
