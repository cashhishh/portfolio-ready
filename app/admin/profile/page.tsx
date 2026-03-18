'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiPlus, FiX, FiSave } from 'react-icons/fi'

interface SocialLink {
  name: string
  url: string
  icon: string
}

interface ProfileData {
  name: string
  title: string
  titles: string[]
  bio: string
  email: string
  phone: string
  address: string
  resumeURL: string
  avatarURL: string
  socialLinks: SocialLink[]
}

const defaultProfile: ProfileData = {
  name: '',
  title: '',
  titles: [],
  bio: '',
  email: '',
  phone: '',
  address: '',
  resumeURL: '',
  avatarURL: '',
  socialLinks: [],
}

export default function AdminProfile() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile)
  const [saving, setSaving] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(data => {
        if (data) {
          setProfile({
            name: data.name || '',
            title: data.title || '',
            titles: data.titles || [],
            bio: data.bio || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            resumeURL: data.resumeURL || '',
            avatarURL: data.avatarURL || '',
            socialLinks: data.socialLinks || [],
          })
        }
      })
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      if (res.ok) toast.success('Profile saved!')
      else toast.error('Failed to save')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  function addTitle() {
    if (newTitle.trim()) {
      setProfile(p => ({ ...p, titles: [...p.titles, newTitle.trim()] }))
      setNewTitle('')
    }
  }

  function removeTitle(index: number) {
    setProfile(p => ({ ...p, titles: p.titles.filter((_, i) => i !== index) }))
  }

  function addSocialLink() {
    setProfile(p => ({
      ...p,
      socialLinks: [...p.socialLinks, { name: '', url: '', icon: '' }],
    }))
  }

  function updateSocialLink(index: number, field: keyof SocialLink, value: string) {
    setProfile(p => ({
      ...p,
      socialLinks: p.socialLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      ),
    }))
  }

  function removeSocialLink(index: number) {
    setProfile(p => ({ ...p, socialLinks: p.socialLinks.filter((_, i) => i !== index) }))
  }

  const inputClass = 'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors'
  const labelClass = 'block text-sm font-medium text-white/60 mb-2'

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="text-white/40 mt-2">Your personal information</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50"
        >
          <FiSave className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <div className="p-6 rounded-2xl bg-white/3 border border-white/6 space-y-5">
          <h3 className="text-lg font-semibold text-white mb-4">Basic Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Full Name</label>
              <input className={inputClass} value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" />
            </div>
            <div>
              <label className={labelClass}>Primary Title</label>
              <input className={inputClass} value={profile.title} onChange={e => setProfile(p => ({ ...p, title: e.target.value }))} placeholder="Frontend Developer" />
            </div>
          </div>

          {/* Rotating Titles */}
          <div>
            <label className={labelClass}>Rotating Titles (Hero Section)</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {profile.titles.map((t, i) => (
                <span key={i} className="flex items-center gap-1 px-3 py-1.5 bg-white/10 text-white text-sm rounded-lg">
                  {t}
                  <button onClick={() => removeTitle(i)} className="text-white/40 hover:text-white ml-1"><FiX className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input className={inputClass} value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Add a title..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTitle())} />
              <button onClick={addTitle} className="px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/15 transition-colors"><FiPlus /></button>
            </div>
          </div>

          <div>
            <label className={labelClass}>Bio</label>
            <textarea className={`${inputClass} h-32 resize-none`} value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} placeholder="Tell about yourself..." />
          </div>
        </div>

        {/* Contact Info */}
        <div className="p-6 rounded-2xl bg-white/3 border border-white/6 space-y-5">
          <h3 className="text-lg font-semibold text-white mb-4">Contact Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Email</label>
              <input className={inputClass} type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} placeholder="you@example.com" />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input className={inputClass} value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="+91 xxxxxxxxxx" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Address</label>
            <input className={inputClass} value={profile.address} onChange={e => setProfile(p => ({ ...p, address: e.target.value }))} placeholder="City, Country" />
          </div>
        </div>

        {/* Media */}
        <div className="p-6 rounded-2xl bg-white/3 border border-white/6 space-y-5">
          <h3 className="text-lg font-semibold text-white mb-4">Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Avatar URL</label>
              <input className={inputClass} value={profile.avatarURL} onChange={e => setProfile(p => ({ ...p, avatarURL: e.target.value }))} placeholder="https://..." />
            </div>
            <div>
              <label className={labelClass}>Resume URL</label>
              <input className={inputClass} value={profile.resumeURL} onChange={e => setProfile(p => ({ ...p, resumeURL: e.target.value }))} placeholder="https://drive.google.com/..." />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="p-6 rounded-2xl bg-white/3 border border-white/6 space-y-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Social Links</h3>
            <button onClick={addSocialLink} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 text-white text-sm rounded-lg hover:bg-white/15 transition-colors">
              <FiPlus className="w-3 h-3" /> Add Link
            </button>
          </div>
          {profile.socialLinks.map((link, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                <input className={inputClass} value={link.name} onChange={e => updateSocialLink(i, 'name', e.target.value)} placeholder="GitHub" />
                <input className={inputClass} value={link.url} onChange={e => updateSocialLink(i, 'url', e.target.value)} placeholder="https://github.com/..." />
                <input className={inputClass} value={link.icon} onChange={e => updateSocialLink(i, 'icon', e.target.value)} placeholder="FiGithub" />
              </div>
              <button onClick={() => removeSocialLink(i)} className="p-3 text-white/30 hover:text-red-400 transition-colors"><FiX /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
