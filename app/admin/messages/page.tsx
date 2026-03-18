'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiTrash2, FiMail, FiCheck } from 'react-icons/fi'

interface MessageData {
  id: string
  name: string
  email: string
  content: string
  read: boolean
  createdAt: string
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<MessageData[]>([])

  const fetchAll = async () => {
    const res = await fetch('/api/contact')
    const data = await res.json()
    setMessages(Array.isArray(data) ? data : [])
  }

  useEffect(() => { fetchAll() }, [])

  async function markRead(id: string, read: boolean) {
    const res = await fetch('/api/contact', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, read }),
    })
    if (res.ok) fetchAll()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this message?')) return
    const res = await fetch(`/api/contact?id=${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Deleted!'); fetchAll() }
  }

  const unreadCount = messages.filter(m => !m.read).length

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Messages</h1>
          <p className="text-white/40 mt-2">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'Contact form submissions'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-5 rounded-2xl border transition-colors ${
              msg.read
                ? 'bg-white/2 border-white/4'
                : 'bg-white/5 border-white/8'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-medium">{msg.name}</h3>
                  {!msg.read && <span className="w-2 h-2 bg-blue-400 rounded-full" />}
                </div>
                <p className="text-white/40 text-sm">{msg.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/20">
                  {new Date(msg.createdAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </span>
                {!msg.read && (
                  <button onClick={() => markRead(msg.id, true)} className="p-1.5 text-white/30 hover:text-green-400 transition-colors" title="Mark as read">
                    <FiCheck className="w-4 h-4" />
                  </button>
                )}
                <a href={`mailto:${msg.email}`} className="p-1.5 text-white/30 hover:text-blue-400 transition-colors" title="Reply">
                  <FiMail className="w-4 h-4" />
                </a>
                <button onClick={() => handleDelete(msg.id)} className="p-1.5 text-white/30 hover:text-red-400 transition-colors" title="Delete">
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-center text-white/30 py-12">No messages yet.</p>
        )}
      </div>
    </div>
  )
}
