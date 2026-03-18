'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [cursorText, setCursorText] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { damping: 25, stiffness: 250 })
  const springY = useSpring(mouseY, { damping: 25, stiffness: 250 })

  useEffect(() => {
    // Only show custom cursor on desktop
    const isTouchDevice = 'ontouchstart' in window
    if (isTouchDevice) return

    const showCursor = () => setIsVisible(true)
    showCursor()

    function onMouseMove(e: MouseEvent) {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    function onMouseOver(e: MouseEvent) {
      const target = e.target as HTMLElement
      const interactive = target.closest('a, button, [data-cursor]')
      if (interactive) {
        setIsHovering(true)
        const text = interactive.getAttribute('data-cursor') || ''
        setCursorText(text)
      } else {
        setIsHovering(false)
        setCursorText('')
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseover', onMouseOver)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', onMouseOver)
    }
  }, [mouseX, mouseY])

  if (!isVisible) return null

  return (
    <>
      {/* Outer ring */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-9999 mix-blend-difference"
        style={{ x: springX, y: springY }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80 flex items-center justify-center"
          animate={{
            width: isHovering ? (cursorText ? 80 : 48) : 32,
            height: isHovering ? (cursorText ? 80 : 48) : 32,
            backgroundColor: isHovering ? 'rgba(255,255,255,0.08)' : 'transparent',
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          {cursorText && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[10px] font-medium text-white uppercase tracking-wider"
            >
              {cursorText}
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {/* Inner dot */}
      <motion.div
        ref={cursorDotRef}
        className="fixed top-0 left-0 pointer-events-none z-9999 mix-blend-difference"
        style={{ x: mouseX, y: mouseY }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          animate={{
            width: isHovering ? 4 : 6,
            height: isHovering ? 4 : 6,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        />
      </motion.div>

      <style jsx global>{`
        @media (pointer: fine) {
          * { cursor: none !important; }
        }
      `}</style>
    </>
  )
}
