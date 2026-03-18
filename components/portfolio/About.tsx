'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { FiMapPin, FiMail, FiPhone, FiGithub, FiLinkedin, FiTwitter, FiGlobe } from 'react-icons/fi'

interface SocialLink {
  name: string
  url: string
  icon: string
}

const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FiGithub: FiGithub,
  FiLinkedin: FiLinkedin,
  FiTwitter: FiTwitter,
  FiMail: FiMail,
  FiGlobe: FiGlobe,
}

interface AboutProps {
  name: string
  bio: string
  avatarURL?: string
  email?: string
  phone?: string
  address?: string
  socialLinks?: SocialLink[]
}

export default function About({ name, bio, avatarURL, email, phone, address, socialLinks = [] }: AboutProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
        >
          {/* Section label */}
          <p className="text-white/30 text-sm tracking-[0.3em] uppercase mb-4">About Me</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 sm:mb-16">
            Get to know me<span className="text-white/20">.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -40 }}
            animate={isInView ? { opacity: 1, scale: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-2 relative"
          >
            <div className="relative aspect-3/4 rounded-3xl overflow-hidden bg-white/3 border border-white/6">
              {avatarURL ? (
                <Image
                  src={avatarURL}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl font-bold text-white/10">
                    {name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
              {/* Image overlay gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-60" />
            </div>

            {/* Decorative border */}
            <div className="absolute -inset-px rounded-3xl border border-white/6 -z-10 translate-x-3 translate-y-3" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-3 space-y-8"
          >
            <div className="text-lg text-white/60 leading-relaxed space-y-4">
              {bio.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Contact cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              {email && (
                <motion.a
                  href={`mailto:${email}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white/3 border border-white/6 hover:border-white/10 transition-colors group"
                >
                  <FiMail className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
                  <span className="text-sm text-white/50 truncate">{email}</span>
                </motion.a>
              )}
              {phone && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white/3 border border-white/6"
                >
                  <FiPhone className="w-4 h-4 text-white/30" />
                  <span className="text-sm text-white/50">{phone}</span>
                </motion.div>
              )}
              {address && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.7 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white/3 border border-white/6"
                >
                  <FiMapPin className="w-4 h-4 text-white/30" />
                  <span className="text-sm text-white/50">{address}</span>
                </motion.div>
              )}
            </div>

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3 pt-2">
                {socialLinks.map((link, i) => {
                  const IconComp = socialIconMap[link.icon] || FiGlobe
                  return (
                    <motion.a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      whileHover={{ y: -2, scale: 1.1 }}
                      className="p-2.5 rounded-xl bg-white/3 border border-white/6 text-white/40 hover:text-white hover:border-white/20 transition-all duration-300"
                      title={link.name}
                    >
                      <IconComp className="w-4 h-4" />
                    </motion.a>
                  )
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
