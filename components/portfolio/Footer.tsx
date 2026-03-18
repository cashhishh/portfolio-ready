'use client'

import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiArrowUp, FiGlobe } from 'react-icons/fi'
import { SiLeetcode } from 'react-icons/si'

interface SocialLink {
  name: string
  url: string
  icon: string
}

interface FooterProps {
  name: string
  socialLinks: SocialLink[]
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FiGithub: FiGithub,
  FiLinkedin: FiLinkedin,
  FiTwitter: FiTwitter,
  FiMail: FiMail,
  FiGlobe: FiGlobe,
  SiLeetcode: SiLeetcode,
}

function ensureHttps(url: string): string {
  if (!url) return url
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:')) return url
  return `https://${url}`
}

export default function Footer({ name, socialLinks }: FooterProps) {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative border-t border-white/4 py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link, i) => {
              const IconComp = iconMap[link.icon] || FiGlobe
              return (
                <motion.a
                  key={i}
                  href={ensureHttps(link.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="p-2.5 rounded-xl bg-white/3 border border-white/6 text-white/40 hover:text-white hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all duration-300"
                  title={link.name}
                >
                  <IconComp className="w-4 h-4" />
                </motion.a>
              )
            })}
          </div>

          {/* Copyright */}
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} {name}. Crafted with precision.
          </p>

          {/* Back to top */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -3 }}
            className="p-2.5 rounded-xl bg-white/3 border border-white/6 text-white/40 hover:text-white hover:border-white/20 transition-all duration-300"
          >
            <FiArrowUp className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </footer>
  )
}
