'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiBookOpen } from 'react-icons/fi'

interface EducationItem {
  id: string
  institution: string
  degree: string
  field?: string | null
  year: string
  description?: string | null
}

interface EducationProps {
  education: EducationItem[]
}

export default function Education({ education }: EducationProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  if (education.length === 0) return null

  return (
    <section id="education" className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-white/30 text-sm tracking-[0.3em] uppercase mb-4">Education</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 sm:mb-16">
            Academic background<span className="text-white/20">.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {education.map((edu, i) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-4 sm:p-6 rounded-2xl bg-white/2 border border-white/6 hover:border-white/10 transition-all duration-300 group"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 rounded-xl bg-white/3 border border-white/6 group-hover:border-white/10 transition-colors shrink-0">
                  <FiBookOpen className="w-5 h-5 text-white/30 group-hover:text-white/50 transition-colors" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-white wrap-break-word">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                  <p className="text-white/50 text-sm wrap-break-word">{edu.institution}</p>
                  <p className="text-white/30 text-xs mt-1 font-mono">{edu.year}</p>
                  {edu.description && <p className="text-white/40 text-sm mt-3 leading-relaxed">{edu.description}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
