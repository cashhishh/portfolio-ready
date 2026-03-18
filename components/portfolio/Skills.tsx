'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
}

interface SkillsProps {
  skills: Skill[]
}

const categoryColors: Record<string, string> = {
  Frontend: 'from-blue-500/20 to-blue-500/0 border-blue-500/20 hover:border-blue-500/40',
  Backend: 'from-emerald-500/20 to-emerald-500/0 border-emerald-500/20 hover:border-emerald-500/40',
  Database: 'from-amber-500/20 to-amber-500/0 border-amber-500/20 hover:border-amber-500/40',
  DevOps: 'from-purple-500/20 to-purple-500/0 border-purple-500/20 hover:border-purple-500/40',
  Tools: 'from-rose-500/20 to-rose-500/0 border-rose-500/20 hover:border-rose-500/40',
  Languages: 'from-cyan-500/20 to-cyan-500/0 border-cyan-500/20 hover:border-cyan-500/40',
  Other: 'from-white/10 to-white/0 border-white/10 hover:border-white/20',
}

export default function Skills({ skills }: SkillsProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const grouped = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  return (
    <section id="skills" className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-white/30 text-sm tracking-[0.3em] uppercase mb-4">Skills</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 sm:mb-16">
            Tech I work with<span className="text-white/20">.</span>
          </h2>
        </motion.div>

        <div className="space-y-12">
          {Object.entries(grouped).map(([category, items], catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: catIndex * 0.1 }}
            >
              <h3 className="text-sm font-medium text-white/30 uppercase tracking-widest mb-5">
                {category}
              </h3>
              <div className="flex flex-wrap gap-3">
                {items.map((skill, i) => {
                  const colors = categoryColors[category] || categoryColors.Other
                  return (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                      transition={{
                        duration: 0.4,
                        delay: catIndex * 0.1 + i * 0.05,
                        ease: [0.215, 0.61, 0.355, 1],
                      }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className={`group relative px-5 py-3 rounded-xl bg-linear-to-b ${colors} border backdrop-blur-sm transition-all duration-300 cursor-default`}
                    >
                      <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                        {skill.name}
                      </span>

                      {/* Proficiency bar (shows on hover) */}
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 rounded-full bg-white/30"
                        initial={{ width: 0 }}
                        whileHover={{ width: `${skill.proficiency}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      />
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
