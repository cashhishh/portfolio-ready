'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

import SmoothScroll from './SmoothScroll'
import Hero from './Hero'
import About from './About'
import Skills from './Skills'
import Experience from './Experience'
import Projects from './Projects'
import Education from './Education'
import Contact from './Contact'
import Footer from './Footer'

const Navbar = dynamic(() => import('./Navbar'), { ssr: false })

interface Profile {
  name: string
  title: string
  titles: string[]
  bio: string
  email: string
  phone: string
  address: string
  resumeURL: string
  avatarURL: string
  socialLinks: { name: string; url: string; icon: string }[]
}

export default function PortfolioPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [skills, setSkills] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [experiences, setExperiences] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [projects, setProjects] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [education, setEducation] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, skillsRes, expRes, projRes, eduRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/skills'),
          fetch('/api/experience'),
          fetch('/api/projects'),
          fetch('/api/education'),
        ])

        const [profileData, skillsData, expData, projData, eduData] = await Promise.all([
          profileRes.json(),
          skillsRes.json(),
          expRes.json(),
          projRes.json(),
          eduRes.json(),
        ])

        setProfile(profileData)
        setSkills(Array.isArray(skillsData) ? skillsData : [])
        setExperiences(Array.isArray(expData) ? expData : [])
        setProjects(Array.isArray(projData) ? projData : [])
        setEducation(Array.isArray(eduData) ? eduData : [])
      } catch (err) {
        console.error('Failed to load portfolio data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    window.scrollTo(0, 0)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-white/10 border-t-white/60 rounded-full animate-spin" />
          <p className="text-white/20 text-sm tracking-widest uppercase">Loading</p>
        </div>
      </div>
    )
  }

  if (!profile || !profile.name) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white/80 mb-2">Portfolio</h1>
          <p className="text-white/30 text-sm">Content coming soon.</p>
        </div>
      </div>
    )
  }

  return (
    <SmoothScroll>
      <Navbar />

      <main className="relative bg-background text-white overflow-x-hidden">
        <Hero
          name={profile.name}
          title={profile.title}
          titles={profile.titles || []}
          resumeURL={profile.resumeURL}
        />

        <About
          name={profile.name}
          bio={profile.bio}
          avatarURL={profile.avatarURL}
          email={profile.email}
          phone={profile.phone}
          address={profile.address}
          socialLinks={profile.socialLinks || []}
        />

        {skills.length > 0 && <Skills skills={skills} />}

        {experiences.length > 0 && <Experience experiences={experiences} />}

        {projects.length > 0 && <Projects projects={projects} />}

        {education.length > 0 && <Education education={education} />}

        <Contact />

        <Footer
          name={profile.name}
          socialLinks={profile.socialLinks || []}
        />
      </main>
    </SmoothScroll>
  )
}
