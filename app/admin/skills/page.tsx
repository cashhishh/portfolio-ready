'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi'

interface SkillData {
  id?: string
  name: string
  category: string
  proficiency: number
  icon: string
}

const empty: SkillData = { name: '', category: '', proficiency: 80, icon: '' }

const categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'AI/ML', 'Tools', 'Languages', 'Other']

export default function AdminSkills() {
  const [items, setItems] = useState<SkillData[]>([])
  const [editing, setEditing] = useState<SkillData | null>(null)
  const [isNew, setIsNew] = useState(false)

  const fetchAll = async () => {
    const res = await fetch('/api/skills')
    const data = await res.json()
    setItems(Array.isArray(data) ? data : [])
  }

  useEffect(() => { setTimeout(() => fetchAll(), 0) }, [])

  async function handleSave() {
    if (!editing) return
    const method = isNew ? 'POST' : 'PUT'
    const res = await fetch('/api/skills', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    })
    if (res.ok) {
      toast.success(isNew ? 'Skill added!' : 'Skill updated!')
      setEditing(null)
      fetchAll()
    } else {
      toast.error('Failed to save')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this skill?')) return
    const res = await fetch(`/api/skills?id=${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Deleted!'); fetchAll() }
  }

  // Group by category
  const grouped = items.reduce((acc, skill) => {
    const cat = skill.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {} as Record<string, SkillData[]>)

  const inputClass = 'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors'
  const labelClass = 'block text-sm font-medium text-white/60 mb-2'

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Skills</h1>
          <p className="text-white/40 mt-2">Your technical skills</p>
        </div>
        <button
          onClick={() => { setEditing({ ...empty }); setIsNew(true) }}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-colors"
        >
          <FiPlus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      {editing && (
        <div className="mb-8 p-6 rounded-2xl bg-white/3 border border-white/6 space-y-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">{isNew ? 'New Skill' : 'Edit Skill'}</h3>
            <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white"><FiX /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Skill Name</label>
              <input className={inputClass} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="React" />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select className={`${inputClass} [&>option]:bg-[#1a1a1a] [&>option]:text-white`} value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Proficiency (0-100)</label>
              <input className={inputClass} type="number" min="0" max="100" value={editing.proficiency} onChange={e => setEditing({ ...editing, proficiency: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
          <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-colors">
            <FiSave className="w-4 h-4" /> Save
          </button>
        </div>
      )}

      {/* Grouped display */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([category, skills]) => (
          <div key={category}>
            <h3 className="text-sm font-medium text-white/40 mb-3 uppercase tracking-wider">{category}</h3>
            <div className="space-y-2">
              {skills.map((skill) => (
                <div key={skill.id} className="p-4 rounded-xl bg-white/3 border border-white/6 flex items-center justify-between group hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-white font-medium">{skill.name}</span>
                    <div className="flex-1 max-w-xs">
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-white/30 rounded-full" style={{ width: `${skill.proficiency}%` }} />
                      </div>
                    </div>
                    <span className="text-xs text-white/30">{skill.proficiency}%</span>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditing(skill); setIsNew(false) }} className="p-2 text-white/40 hover:text-white"><FiEdit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(skill.id!)} className="p-2 text-white/40 hover:text-red-400"><FiTrash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {items.length === 0 && !editing && (
          <p className="text-center text-white/30 py-12">No skills added yet.</p>
        )}
      </div>
    </div>
  )
}
