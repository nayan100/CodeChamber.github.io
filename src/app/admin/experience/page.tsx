'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { supabase } from '@/lib/supabase/client'
import { saveExperience, deleteExperience } from '@/lib/actions'
import { Plus, Pencil, Trash2, X, Loader2, CheckCircle2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import type { Experience } from '@/types'

const schema = z.object({
  role: z.string().min(1, 'Role is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().optional(),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional(),
  current: z.boolean().optional(),
  achievements: z.string().optional(),
})
type FormData = z.infer<typeof schema>

function Modal({ open, onClose, exp, onSaved }: { open: boolean; onClose: () => void; exp: Experience | null; onSaved: () => void }) {
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })
  const isCurrent = watch('current')

  useEffect(() => {
    if (exp) {
      reset({
        role: exp.role, company: exp.company, location: exp.location ?? '',
        start_date: exp.start_date, end_date: exp.end_date ?? '',
        current: exp.current, achievements: exp.achievements.join('\n'),
      })
    } else {
      reset({ role: '', company: '', location: '', start_date: '', end_date: '', current: false, achievements: '' })
    }
  }, [exp, reset, open])

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        id: exp?.id,
        role: data.role,
        company: data.company,
        location: data.location || null,
        start_date: data.start_date,
        end_date: data.current ? null : (data.end_date || null),
        current: data.current ?? false,
        achievements: data.achievements ? data.achievements.split('\n').map(s => s.trim()).filter(Boolean) : [],
      }

      await saveExperience(payload)
      toast.success(exp ? 'Updated!' : 'Created!')
      onSaved()
      onClose()
    } catch (err: any) {
      toast.error(err.message || 'Failed to save')
    }
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="elevated-surface rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-text-heading font-bold text-lg">{exp ? 'Edit Experience' : 'Add Experience'}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-heading"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {(['role', 'company', 'location'] as const).map(field => (
            <div key={field}>
              <label className="block text-sm text-text-muted mb-1 capitalize">{field}{field !== 'location' ? ' *' : ''}</label>
              <input {...register(field)} placeholder={field === 'role' ? 'VP of Technology' : field === 'company' ? 'Company Name' : 'City, Country'}
                className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-text placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all" />
              {errors[field] && <p className="text-error text-xs mt-1">{errors[field]?.message}</p>}
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-text-muted mb-1">Start Date *</label>
              <input type="date" {...register('start_date')}
                className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all" />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">End Date</label>
              <input type="date" {...register('end_date')} disabled={isCurrent}
                className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm disabled:opacity-40 transition-all" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('current')} className="rounded accent-primary" />
            <span className="text-sm text-text">Currently working here</span>
          </label>
          <div>
            <label className="block text-sm text-text-muted mb-1">Achievements (one per line)</label>
            <textarea {...register('achievements')} rows={5} placeholder="Led a team of 12 engineers...&#10;Reduced infrastructure cost by 40%..."
              className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-text placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none transition-all" />
          </div>
          <div className="flex gap-3 pt-4 border-t border-border mt-6">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 py-2.5">Cancel</button>
            <button type="submit" disabled={isSubmitting}
              className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5">
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {exp ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function fmtDate(d: string | null, current: boolean) {
  if (current) return 'Present'
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Experience | null>(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('experience').select('*').order('sort_order')
    setExperiences(data ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience entry?')) return
    try {
      await deleteExperience(id)
      toast.success('Deleted')
      load()
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-heading">Experience</h1>
            <p className="text-text-muted text-sm mt-1">{experiences.length} entries</p>
          </div>
          <button onClick={() => { setEditing(null); setModalOpen(true) }}
            className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Entry
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-primary" /></div>
        ) : (
          <div className="space-y-4">
            {experiences.map(exp => (
              <div key={exp.id} className="elevated-surface p-6 flex flex-col sm:flex-row sm:items-start gap-4 hover:-translate-y-[2px] transition-transform">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <h3 className="text-text-heading font-semibold text-lg">{exp.role}</h3>
                    <span className="text-primary font-medium">@ {exp.company}</span>
                    {exp.current && <span className="chip chip-success">Current</span>}
                  </div>
                  <p className="text-text-muted text-sm mb-3">
                    {fmtDate(exp.start_date, false)} — {fmtDate(exp.end_date, exp.current)} 
                    {exp.location && <span className="ml-1 opacity-70">· {exp.location}</span>}
                  </p>
                  <ul className="space-y-1.5">
                    {exp.achievements.slice(0, 2).map((a, i) => (
                      <li key={i} className="flex items-start gap-2 text-text-muted text-sm">
                        <CheckCircle2 size={16} className="text-accent mt-0.5 shrink-0" />
                        <span className="leading-relaxed">{a}</span>
                      </li>
                    ))}
                    {exp.achievements.length > 2 && <li className="text-text-disabled text-xs ml-6 font-medium">+{exp.achievements.length - 2} more achievements</li>}
                  </ul>
                </div>
                <div className="flex items-center gap-2 shrink-0 sm:self-start self-end">
                  <button onClick={() => { setEditing(exp); setModalOpen(true) }} className="p-2 rounded-xl bg-surface-2 border border-border text-text-muted hover:text-text-heading hover:bg-border transition-all"><Pencil size={15} /></button>
                  <button onClick={() => handleDelete(exp.id)} className="p-2 rounded-xl border border-error-bg text-error hover:bg-error-bg transition-all"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
            {experiences.length === 0 && <div className="text-center py-20 text-text-disabled">No experience entries yet.</div>}
          </div>
        )}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} exp={editing} onSaved={load} />
    </AdminLayout>
  )
}
