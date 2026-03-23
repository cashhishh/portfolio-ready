'use client'

import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiUpload, FiChevronUp, FiChevronDown } from 'react-icons/fi'

interface LinkItem {
  name: string
  url: string
}

interface ProjectData {
  id?: string
  name: string
  description: string
  mdContent: string
  techStack: string[]
  links: LinkItem[]
  videoURL: string
  githubURL: string
  images: string[]
  featured: boolean
  experienceId: string
}

const empty: ProjectData = {
  name: '', description: '', mdContent: '', techStack: [], links: [],
  videoURL: '', githubURL: '', images: [], featured: false, experienceId: '',
}

export default function AdminProjects() {
  const [items, setItems] = useState<ProjectData[]>([])
  const [experiences, setExperiences] = useState<{ id: string; company: string; role: string }[]>([])
  const [editing, setEditing] = useState<ProjectData | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [newTech, setNewTech] = useState('')
  const [uploadingImages, setUploadingImages] = useState(false)
  const [savingOrder, setSavingOrder] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchAll = async () => {
    const res = await fetch('/api/projects')
    const data = await res.json()
    setItems(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    fetchAll()
    fetch('/api/experience').then(r => r.json()).then(d => setExperiences(Array.isArray(d) ? d : []))
  }, [])

  async function handleSave() {
    if (!editing) return
    const method = isNew ? 'POST' : 'PUT'
    const res = await fetch('/api/projects', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    })
    if (res.ok) {
      toast.success(isNew ? 'Project added!' : 'Project updated!')
      setEditing(null)
      fetchAll()
    } else {
      toast.error('Failed to save')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this project?')) return
    const res = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Deleted!'); fetchAll() }
  }

  function addLink() {
    if (!editing) return
    setEditing({ ...editing, links: [...editing.links, { name: '', url: '' }] })
  }

  function updateLink(index: number, field: keyof LinkItem, value: string) {
    if (!editing) return
    setEditing({
      ...editing,
      links: editing.links.map((l, i) => i === index ? { ...l, [field]: value } : l),
    })
  }

  function removeLink(index: number) {
    if (!editing) return
    setEditing({ ...editing, links: editing.links.filter((_, i) => i !== index) })
  }

  async function moveItem(index: number, direction: 'up' | 'down') {
    const newItems = [...items]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= newItems.length) return
    ;[newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]]
    setItems(newItems)
    setSavingOrder(true)
    try {
      await Promise.all(
        newItems.map((item, i) =>
          fetch('/api/projects', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...item, order: i }),
          })
        )
      )
      toast.success('Order saved!')
    } catch {
      toast.error('Failed to save order')
    }
    setSavingOrder(false)
  }

  async function handleImageUpload(files: FileList | null) {
    if (!files || files.length === 0 || !editing) return
    setUploadingImages(true)
    const uploaded: string[] = []
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (res.ok) {
        const { url } = await res.json()
        uploaded.push(url)
      } else {
        const { error } = await res.json()
        toast.error(error || 'Upload failed')
      }
    }
    if (uploaded.length > 0) {
      setEditing({ ...editing, images: [...editing.images, ...uploaded] })
      toast.success(`${uploaded.length} image${uploaded.length > 1 ? 's' : ''} uploaded!`)
    }
    setUploadingImages(false)
  }

  const inputClass = 'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors'
  const labelClass = 'block text-sm font-medium text-white/60 mb-2'

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-white/40 mt-2">Manage your portfolio projects</p>
        </div>
        <button
          onClick={() => { setEditing({ ...empty }); setIsNew(true) }}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-colors"
        >
          <FiPlus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* Edit */}
      {editing && (
        <div className="mb-8 p-6 rounded-2xl bg-white/3 border border-white/6 space-y-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">{isNew ? 'New Project' : 'Edit Project'}</h3>
            <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white"><FiX /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Project Name</label>
              <input className={inputClass} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="My Project" />
            </div>
            <div>
              <label className={labelClass}>Linked Experience</label>
              <select className={`${inputClass} [&>option]:bg-[#1a1a1a] [&>option]:text-white`} value={editing.experienceId} onChange={e => setEditing({ ...editing, experienceId: e.target.value })}>
                <option value="">None (Personal Project)</option>
                {experiences.map(exp => (
                  <option key={exp.id} value={exp.id}>{exp.company} — {exp.role}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Short Description</label>
            <textarea className={`${inputClass} h-20 resize-none`} value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="A brief description..." />
          </div>
          <div>
            <label className={labelClass}>Detailed Description (Markdown)</label>
            <textarea className={`${inputClass} h-40 resize-none font-mono text-sm`} value={editing.mdContent} onChange={e => setEditing({ ...editing, mdContent: e.target.value })} placeholder="# Project Details\n\nWrite in markdown..." />
          </div>

          {/* Tech Stack */}
          <div>
            <label className={labelClass}>Tech Stack</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {editing.techStack.map((t, i) => (
                <span key={i} className="flex items-center gap-1 px-3 py-1.5 bg-white/10 text-white text-sm rounded-lg">
                  {t}
                  <button onClick={() => setEditing({ ...editing, techStack: editing.techStack.filter((_, idx) => idx !== i) })} className="text-white/40 hover:text-white ml-1"><FiX className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input className={inputClass} value={newTech} onChange={e => setNewTech(e.target.value)} placeholder="React, Next.js, etc." onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (newTech.trim()) { setEditing({ ...editing, techStack: [...editing.techStack, newTech.trim()] }); setNewTech('') } } }} />
              <button onClick={() => { if (newTech.trim()) { setEditing({ ...editing, techStack: [...editing.techStack, newTech.trim()] }); setNewTech('') } }} className="px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/15 transition-colors"><FiPlus /></button>
            </div>
          </div>

          {/* Links */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelClass}>Links</label>
              <button onClick={addLink} className="flex items-center gap-1 px-3 py-1 bg-white/10 text-white text-xs rounded-lg hover:bg-white/15 transition-colors"><FiPlus className="w-3 h-3" /> Add Link</button>
            </div>
            {editing.links.map((link, i) => (
              <div key={i} className="flex gap-3 items-center mb-2">
                <input className={inputClass} value={link.name} onChange={e => updateLink(i, 'name', e.target.value)} placeholder="Link name (e.g. Live Demo)" />
                <input className={inputClass} value={link.url} onChange={e => updateLink(i, 'url', e.target.value)} placeholder="https://..." />
                <button onClick={() => removeLink(i)} className="p-2 text-white/30 hover:text-red-400"><FiX /></button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>GitHub URL (optional)</label>
              <div className="relative">
                <input className={`${inputClass} pr-10`} value={editing.githubURL} onChange={e => setEditing({ ...editing, githubURL: e.target.value })} placeholder="https://github.com/..." />
                {editing.githubURL && (
                  <button onClick={() => setEditing({ ...editing, githubURL: '' })} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-red-400 transition-colors">
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className={labelClass}>Video URL (optional)</label>
              <div className="relative">
                <input className={`${inputClass} pr-10`} value={editing.videoURL} onChange={e => setEditing({ ...editing, videoURL: e.target.value })} placeholder="https://youtube.com/..." />
                {editing.videoURL && (
                  <button onClick={() => setEditing({ ...editing, videoURL: '' })} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-red-400 transition-colors">
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className={labelClass}>Project Images</label>

            {/* Thumbnails */}
            {editing.images.length > 0 && (
              <div className="flex gap-3 flex-wrap mb-3">
                {editing.images.map((img, i) => (
                  <div key={i} className="relative group/img">
                    <img
                      src={img}
                      alt={`Image ${i + 1}`}
                      className="w-24 h-24 object-cover rounded-xl border border-white/10"
                      onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3' }}
                    />
                    <button
                      onClick={() => setEditing({ ...editing, images: editing.images.filter((_, idx) => idx !== i) })}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                    >
                      <FiX className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={e => handleImageUpload(e.target.files)}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImages}
              className="flex items-center gap-2 px-4 py-3 w-full justify-center border border-dashed border-white/20 rounded-xl text-white/50 hover:border-white/40 hover:text-white/80 hover:bg-white/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FiUpload className="w-4 h-4" />
              {uploadingImages ? 'Uploading...' : 'Click to upload images (or select multiple)'}
            </button>
            <p className="text-white/20 text-xs mt-1.5">PNG, JPG, WEBP — max 5MB each. Multiple images allowed.</p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={editing.featured} onChange={e => setEditing({ ...editing, featured: e.target.checked })} className="w-4 h-4 rounded bg-white/10 border-white/20" />
              <span className="text-sm text-white/60">Featured project (larger card on portfolio)</span>
            </label>
          </div>

          <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-colors">
            <FiSave className="w-4 h-4" /> Save
          </button>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="p-5 rounded-2xl bg-white/3 border border-white/6 flex items-center justify-between group hover:border-white/10 transition-colors">
            {/* Rank + drag handle */}
            <div className="flex items-center gap-3 mr-4 shrink-0">
              <span className="text-white/20 text-xs font-mono w-4 text-center">{index + 1}</span>
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0 || savingOrder}
                  className="p-0.5 text-white/20 hover:text-white disabled:opacity-0 transition-colors"
                ><FiChevronUp className="w-3.5 h-3.5" /></button>
                <button
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === items.length - 1 || savingOrder}
                  className="p-0.5 text-white/20 hover:text-white disabled:opacity-0 transition-colors"
                ><FiChevronDown className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-medium">{item.name}</h3>
                {item.featured && <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-400 rounded-full">Featured</span>}
              </div>
              <p className="text-white/40 text-sm mt-1">{item.description.substring(0, 80)}{item.description.length > 80 ? '...' : ''}</p>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {item.techStack.slice(0, 5).map((t, i) => (
                  <span key={i} className="px-2 py-0.5 text-xs bg-white/5 text-white/50 rounded">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-3 shrink-0">
              <button onClick={() => { setEditing(item); setIsNew(false) }} className="p-2 text-white/40 hover:text-white transition-colors"><FiEdit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(item.id!)} className="p-2 text-white/40 hover:text-red-400 transition-colors"><FiTrash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && !editing && (
          <p className="text-center text-white/30 py-12">No projects yet. Click &quot;Add Project&quot; to get started.</p>
        )}
      </div>
    </div>
  )
}
