'use client'

import { useEffect, useState } from 'react'
import { FiBriefcase, FiFolder, FiCode, FiMail, FiBookOpen } from 'react-icons/fi'
import Link from 'next/link'

interface Stats {
  projects: number
  experience: number
  skills: number
  education: number
  messages: number
  unreadMessages: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    projects: 0, experience: 0, skills: 0, education: 0, messages: 0, unreadMessages: 0,
  })

  useEffect(() => {
    async function fetchStats() {
      try {
        const [projects, experience, skills, education, messages] = await Promise.all([
          fetch('/api/projects').then(r => r.json()),
          fetch('/api/experience').then(r => r.json()),
          fetch('/api/skills').then(r => r.json()),
          fetch('/api/education').then(r => r.json()),
          fetch('/api/contact').then(r => r.json()),
        ])
        setStats({
          projects: projects.length || 0,
          experience: experience.length || 0,
          skills: skills.length || 0,
          education: education.length || 0,
          messages: messages.length || 0,
          unreadMessages: Array.isArray(messages) ? messages.filter((m: { read: boolean }) => !m.read).length : 0,
        })
      } catch {}
    }
    fetchStats()
  }, [])

  const cards = [
    { label: 'Projects', value: stats.projects, icon: FiFolder, href: '/admin/projects', color: 'from-blue-500/20 to-blue-600/5' },
    { label: 'Experience', value: stats.experience, icon: FiBriefcase, href: '/admin/experience', color: 'from-emerald-500/20 to-emerald-600/5' },
    { label: 'Skills', value: stats.skills, icon: FiCode, href: '/admin/skills', color: 'from-purple-500/20 to-purple-600/5' },
    { label: 'Education', value: stats.education, icon: FiBookOpen, href: '/admin/education', color: 'from-amber-500/20 to-amber-600/5' },
    { label: 'Messages', value: stats.messages, icon: FiMail, href: '/admin/messages', color: 'from-rose-500/20 to-rose-600/5', badge: stats.unreadMessages },
  ]

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 mt-2">Manage your portfolio content</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group relative p-6 rounded-2xl bg-white/3 border border-white/6 hover:border-white/10 transition-all duration-300 hover:bg-white/5"
          >
            <div className={`absolute inset-0 rounded-2xl bg-linear-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <card.icon className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors" />
                {card.badge !== undefined && card.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-rose-500 text-white rounded-full">{card.badge} new</span>
                )}
              </div>
              <div className="text-3xl font-bold text-white mb-1">{card.value}</div>
              <div className="text-sm text-white/40">{card.label}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
