'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi'

interface ExperienceData {
  id?: string
  company: string
  role: string
  startDate: string
  endDate: string
  description: string
  companyLogo: string
}

const empty: ExperienceData = {
  company: '', role: '', startDate: '', endDate: '', description: '', companyLogo: '',
}

export default function AdminExperience() {
  const [items, setItems] = useState<ExperienceData[]>([])
  const [editing, setEditing] = useState<ExperienceData | null>(null)
  const [isNew, setIsNew] = useState(false)

  const fetchAll = async () => {
    const res = await fetch('/api/experience')
    const data = await res.json()
    setItems(Array.isArray(data) ? data : [])
  }

  useEffect(() => { fetchAll() }, [])

  async function handleSave() {
    if (!editing) return
    const method = isNew ? 'POST' : 'PUT'
    const res = await fetch('/api/experience', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    })
    if (res.ok) {
      toast.success(isNew ? 'Experience added!' : 'Experience updated!')
      setEditing(null)
      fetchAll()
    } else {
      toast.error('Failed to save')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this experience?')) return
    const res = await fetch(`/api/experience?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Deleted!')
      fetchAll()
    }
  }

  const inputClass = 'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors'
  const labelClass = 'block text-sm font-medium text-white/60 mb-2'

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Experience</h1>
          <p className="text-white/40 mt-2">Your work history</p>
        </div>
        <button
          onClick={() => { setEditing({ ...empty }); setIsNew(true) }}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-colors"
        >
          <FiPlus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="mb-8 p-6 rounded-2xl bg-white/3 border border-white/6 space-y-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">{isNew ? 'New Experience' : 'Edit Experience'}</h3>
            <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white"><FiX /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Company</label>
              <input className={inputClass} value={editing.company} onChange={e => setEditing({ ...editing, company: e.target.value })} placeholder="Company Name" />
            </div>
            <div>
              <label className={labelClass}>Role</label>
              <input className={inputClass} value={editing.role} onChange={e => setEditing({ ...editing, role: e.target.value })} placeholder="Frontend Developer" />
            </div>
            <div>
              <label className={labelClass}>Start Date</label>
              <input className={inputClass} value={editing.startDate} onChange={e => setEditing({ ...editing, startDate: e.target.value })} placeholder="Jan 2024" />
            </div>
            <div>
              <label className={labelClass}>End Date</label>
              <input className={inputClass} value={editing.endDate} onChange={e => setEditing({ ...editing, endDate: e.target.value })} placeholder="Present" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Company Logo URL</label>
            <input className={inputClass} value={editing.companyLogo} onChange={e => setEditing({ ...editing, companyLogo: e.target.value })} placeholder="https://..." />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea className={`${inputClass} h-32 resize-none`} value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="What did you do here..." />
          </div>
          <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-colors">
            <FiSave className="w-4 h-4" /> Save
          </button>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl bg-white/3 border border-white/6 flex items-center justify-between group hover:border-white/10 transition-colors">
            <div>
              <h3 className="text-white font-medium">{item.role}</h3>
              <p className="text-white/40 text-sm">{item.company} · {item.startDate} — {item.endDate || 'Present'}</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setEditing(item); setIsNew(false) }} className="p-2 text-white/40 hover:text-white transition-colors"><FiEdit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(item.id!)} className="p-2 text-white/40 hover:text-red-400 transition-colors"><FiTrash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && !editing && (
          <p className="text-center text-white/30 py-12">No experience added yet. Click &quot;Add Experience&quot; to get started.</p>
        )}
      </div>
    </div>
  )
}
