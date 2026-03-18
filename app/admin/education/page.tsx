'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi'

interface EducationData {
  id?: string
  institution: string
  degree: string
  field: string
  year: string
  description: string
}

const empty: EducationData = { institution: '', degree: '', field: '', year: '', description: '' }

export default function AdminEducation() {
  const [items, setItems] = useState<EducationData[]>([])
  const [editing, setEditing] = useState<EducationData | null>(null)
  const [isNew, setIsNew] = useState(false)

  const fetchAll = async () => {
    const res = await fetch('/api/education')
    const data = await res.json()
    setItems(Array.isArray(data) ? data : [])
  }

  useEffect(() => { fetchAll() }, [])

  async function handleSave() {
    if (!editing) return
    const method = isNew ? 'POST' : 'PUT'
    const res = await fetch('/api/education', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    })
    if (res.ok) {
      toast.success(isNew ? 'Education added!' : 'Education updated!')
      setEditing(null)
      fetchAll()
    } else {
      toast.error('Failed to save')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this entry?')) return
    const res = await fetch(`/api/education?id=${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Deleted!'); fetchAll() }
  }

  const inputClass = 'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors'
  const labelClass = 'block text-sm font-medium text-white/60 mb-2'

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Education</h1>
          <p className="text-white/40 mt-2">Your educational background</p>
        </div>
        <button
          onClick={() => { setEditing({ ...empty }); setIsNew(true) }}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-colors"
        >
          <FiPlus className="w-4 h-4" /> Add Education
        </button>
      </div>

      {editing && (
        <div className="mb-8 p-6 rounded-2xl bg-white/3 border border-white/6 space-y-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">{isNew ? 'New Education' : 'Edit Education'}</h3>
            <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white"><FiX /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Institution</label>
              <input className={inputClass} value={editing.institution} onChange={e => setEditing({ ...editing, institution: e.target.value })} placeholder="University Name" />
            </div>
            <div>
              <label className={labelClass}>Degree</label>
              <input className={inputClass} value={editing.degree} onChange={e => setEditing({ ...editing, degree: e.target.value })} placeholder="B.Tech" />
            </div>
            <div>
              <label className={labelClass}>Field of Study</label>
              <input className={inputClass} value={editing.field} onChange={e => setEditing({ ...editing, field: e.target.value })} placeholder="Computer Science" />
            </div>
            <div>
              <label className={labelClass}>Year</label>
              <input className={inputClass} value={editing.year} onChange={e => setEditing({ ...editing, year: e.target.value })} placeholder="2020 - 2024" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description (optional)</label>
            <textarea className={`${inputClass} h-24 resize-none`} value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="Notable achievements..." />
          </div>
          <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-colors">
            <FiSave className="w-4 h-4" /> Save
          </button>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl bg-white/3 border border-white/6 flex items-center justify-between group hover:border-white/10 transition-colors">
            <div>
              <h3 className="text-white font-medium">{item.degree}{item.field ? ` in ${item.field}` : ''}</h3>
              <p className="text-white/40 text-sm">{item.institution} · {item.year}</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setEditing(item); setIsNew(false) }} className="p-2 text-white/40 hover:text-white"><FiEdit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(item.id!)} className="p-2 text-white/40 hover:text-red-400"><FiTrash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && !editing && (
          <p className="text-center text-white/30 py-12">No education entries yet.</p>
        )}
      </div>
    </div>
  )
}
