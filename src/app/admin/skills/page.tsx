'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { supabase } from '@/lib/supabase/client'
import { saveSkill, deleteSkill } from '@/lib/actions'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Skill } from '@/types'

const CATEGORIES: { key: Skill['category']; label: string; color: string }[] = [
  { key: 'backend', label: 'Backend', color: 'chip-primary' },
  { key: 'devops', label: 'DevOps & Cloud', color: 'chip-info' },
  { key: 'iot_edge', label: 'IoT & Edge', color: 'chip-success' },
  { key: 'frontend', label: 'Frontend', color: 'chip-warning' },
]

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [newSkill, setNewSkill] = useState({ name: '', category: 'backend' as Skill['category'] })
  const [adding, setAdding] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('skills').select('*').order('category').order('sort_order')
    setSkills(data ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const handleAdd = async () => {
    if (!newSkill.name.trim()) { toast.error('Enter a skill name'); return }
    setAdding(true)
    try {
      await saveSkill({ name: newSkill.name.trim(), category: newSkill.category })
      toast.success(`${newSkill.name} added!`)
      setNewSkill(s => ({ ...s, name: '' }))
      load()
    } catch (err: any) {
      toast.error(err.message || 'Failed to add skill')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove "${name}"?`)) return
    try {
      await deleteSkill(id)
      toast.success('Skill removed')
      load()
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-heading">Skills</h1>
          <p className="text-text-muted text-sm mt-1">{skills.length} skills across all categories</p>
        </div>

        {/* Add skill form */}
        <div className="elevated-surface p-5 flex flex-col sm:flex-row gap-3">
          <input
            value={newSkill.name}
            onChange={e => setNewSkill(s => ({ ...s, name: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Skill name (e.g. TimescaleDB)"
            className="flex-1 px-3 py-2.5 bg-background border border-border rounded-xl text-text placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
          />
          <select
            value={newSkill.category}
            onChange={e => setNewSkill(s => ({ ...s, category: e.target.value as Skill['category'] }))}
            className="px-3 py-2.5 bg-background border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
          >
            {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
          <button
            onClick={handleAdd}
            disabled={adding}
            className="btn-primary flex items-center justify-center gap-2"
          >
            {adding ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            Add Skill
          </button>
        </div>

        {/* Skills by category */}
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 size={32} className="animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {CATEGORIES.map(cat => {
              const catSkills = skills.filter(s => s.category === cat.key)
              return (
                <div key={cat.key} className="elevated-surface p-5">
                  <h3 className="text-text-heading font-semibold mb-4">{cat.label} <span className="text-text-muted text-sm font-normal">({catSkills.length})</span></h3>
                  <div className="flex flex-wrap gap-2">
                    {catSkills.map(skill => (
                      <div key={skill.id} className={`chip ${cat.color} hover:shadow-md transition-shadow`}>
                        {skill.name}
                        <button onClick={() => handleDelete(skill.id, skill.name)} className="hover:text-error transition-colors ml-1">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                    {catSkills.length === 0 && <p className="text-text-disabled text-sm">No skills yet</p>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
