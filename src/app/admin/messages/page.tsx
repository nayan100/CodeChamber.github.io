'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { markMessageAsRead, deleteMessage, getMessages } from '@/lib/actions'
import { Mail, MailOpen, Trash2, Loader2, User, Calendar, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import type { ContactMessage } from '@/types'

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const data = await getMessages()
      setMessages(data ?? [])
    } catch (err) {
      toast.error('Failed to load messages')
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleToggleRead = async (msg: ContactMessage) => {
    try {
      await markMessageAsRead(msg.id, !msg.read)
      toast.success(msg.read ? 'Marked as unread' : 'Marked as read')
      load()
    } catch (err: any) {
      toast.error(err.message || 'Failed to update message')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return
    try {
      await deleteMessage(id)
      toast.success('Message deleted')
      load()
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete message')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-heading">Contact Messages</h1>
            <p className="text-text-muted text-sm mt-1">
              {messages.length} messages · {messages.filter(m => !m.read).length} unread
            </p>
          </div>
          <button 
            onClick={load}
            className="px-4 py-2 rounded-xl bg-surface-2 hover:bg-border border border-border text-text text-sm font-medium transition-all"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`elevated-surface rounded-2xl p-6 border transition-all ${
                  msg.read 
                    ? 'border-border opacity-80' 
                    : 'border-primary/30 bg-primary/5 shadow-md shadow-primary/5'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 text-text-heading font-semibold">
                        <User size={16} className="text-text-muted" />
                        {msg.name}
                      </div>
                      <div className="flex items-center gap-2 text-text-muted text-sm border-l border-border pl-4">
                        <Mail size={14} />
                        {msg.email}
                      </div>
                      <div className="flex items-center gap-2 text-text-disabled text-xs border-l border-border pl-4">
                        <Calendar size={14} />
                        {new Date(msg.created_at).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <MessageSquare size={18} className="text-primary shrink-0 mt-1" />
                      <p className="text-text text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-start">
                    <button 
                      onClick={() => handleToggleRead(msg)}
                      className={`p-2.5 rounded-xl border transition-all ${
                        msg.read 
                          ? 'border-border text-text-muted hover:text-primary hover:border-primary/30' 
                          : 'border-primary/50 bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                      title={msg.read ? 'Mark as unread' : 'Mark as read'}
                    >
                      {msg.read ? <MailOpen size={18} /> : <Mail size={18} />}
                    </button>
                    <button 
                      onClick={() => handleDelete(msg.id)}
                      className="p-2.5 rounded-xl border border-border text-text-muted hover:bg-error-bg hover:text-error hover:border-error-bg transition-all"
                      title="Delete message"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {messages.length === 0 && (
              <div className="text-center py-20 bg-surface-2 rounded-3xl border border-dashed border-border">
                <Mail size={40} className="mx-auto mb-4 text-border" />
                <p className="text-text-muted font-medium">No messages found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
