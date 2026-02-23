'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { supabase } from '@/lib/supabase/client'
import { saveProject, deleteProject } from '@/lib/actions'
import { Plus, Pencil, Trash2, X, Loader2, Github, ExternalLink, Image as ImageIcon, Video } from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import type { Project, ProjectMedia } from '@/types'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  tech_stack: z.string().optional(),
  tags: z.string().optional(),
  github_url: z.string().url().optional().or(z.literal('')),
  demo_url: z.string().url().optional().or(z.literal('')),
  image_url: z.string().optional(), // Main image (legacy)
  thumbnail_url: z.string().optional(),
  featured: z.boolean().optional(),
  media: z.array(z.object({
    type: z.enum(['image', 'video']),
    url: z.string().url('Invalid URL'),
  })).optional(),
})
type FormData = z.infer<typeof schema>

function Modal({
  open, onClose, project, onSaved,
}: {
  open: boolean
  onClose: () => void
  project: Project | null
  onSaved: () => void
}) {
  const {
    register, handleSubmit, reset, control, formState: { errors, isSubmitting },
  } = useForm<FormData>({ 
    resolver: zodResolver(schema),
    defaultValues: { media: [] }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'media'
  })

  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        description: project.description ?? '',
        tech_stack: project.tech_stack.join(', '),
        tags: project.tags.join(', '),
        github_url: project.github_url ?? '',
        demo_url: project.demo_url ?? '',
        image_url: project.image_url ?? '',
        thumbnail_url: project.thumbnail_url ?? '',
        featured: project.featured,
        media: project.media ?? [],
      })
    } else {
      reset({ title: '', description: '', tech_stack: '', tags: '', github_url: '', demo_url: '', image_url: '', thumbnail_url: '', featured: false, media: [] })
    }
  }, [project, reset, open])

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        id: project?.id,
        title: data.title,
        description: data.description || null,
        tech_stack: data.tech_stack ? data.tech_stack.split(',').map(s => s.trim()).filter(Boolean) : [],
        tags: data.tags ? data.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
        github_url: data.github_url || null,
        demo_url: data.demo_url || null,
        image_url: data.image_url || null,
        thumbnail_url: data.thumbnail_url || null,
        media: data.media || [],
        featured: data.featured ?? false,
      }

      await saveProject(payload)
      toast.success(project ? 'Project updated!' : 'Project created!')
      onSaved()
      onClose()
    } catch (err: any) {
      toast.error(err.message || 'Failed to save project')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-white font-bold text-lg">{project ? 'Edit Project' : 'Add Project'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'title', label: 'Title *', placeholder: 'Edge Telemetry Platform' },
              { name: 'github_url', label: 'GitHub URL', placeholder: 'https://github.com/...' },
              { name: 'demo_url', label: 'Demo URL', placeholder: 'https://demo.example.com' },
              { name: 'thumbnail_url', label: 'Thumbnail Image URL', placeholder: 'https://...' },
            ].map(({ name, label, placeholder }) => (
              <div key={name}>
                <label className="block text-sm text-slate-400 mb-1">{label}</label>
                <input
                  {...register(name as keyof FormData)}
                  placeholder={placeholder}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                />
                {errors[name as keyof FormData] && (
                  <p className="text-red-400 text-xs mt-1">{String(errors[name as keyof FormData]?.message)}</p>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'tech_stack', label: 'Tech Stack (comma separated)', placeholder: 'React, Node.js, Docker' },
              { name: 'tags', label: 'Tags (comma separated)', placeholder: 'IoT, Backend, AI' },
            ].map(({ name, label, placeholder }) => (
              <div key={name}>
                <label className="block text-sm text-slate-400 mb-1">{label}</label>
                <input
                  {...register(name as keyof FormData)}
                  placeholder={placeholder}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Project description..."
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm resize-none"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">Media Carousel (Images & Videos)</label>
              <button 
                type="button" 
                onClick={() => append({ type: 'image', url: '' })}
                className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
              >
                <Plus size={14} /> Add Media
              </button>
            </div>
            
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <select 
                    {...register(`media.${index}.type` as const)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                  <div className="flex-1">
                    <input
                      {...register(`media.${index}.url` as const)}
                      placeholder="URL to image or video file"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                    />
                    {errors.media?.[index]?.url && (
                      <p className="text-red-400 text-[10px] mt-0.5">{errors.media[index]?.url?.message}</p>
                    )}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => remove(index)}
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {fields.length === 0 && (
                <p className="text-xs text-slate-500 italic">No media items added.</p>
              )}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('featured')} className="rounded accent-indigo-600" />
            <span className="text-sm text-slate-300">Featured project</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-sm transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
              {project ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('projects').select('*').order('sort_order')
    setProjects(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return
    try {
      await deleteProject(id)
      toast.success('Project deleted')
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
            <h1 className="text-2xl font-bold text-text-heading">Projects</h1>
            <p className="text-text-muted text-sm mt-1">{projects.length} projects in portfolio</p>
          </div>
          <button
            onClick={() => { setEditing(null); setModalOpen(true) }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} /> Add Project
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-primary" /></div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <div key={project.id} className="elevated-surface rounded-xl p-5 flex items-start gap-4 hover:border-border-strong transition-all">
                {project.thumbnail_url && (
                  <div className="w-16 h-16 rounded-lg bg-surface-2 overflow-hidden shrink-0 border border-border">
                    <img src={project.thumbnail_url} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-text-heading font-semibold">{project.title}</h3>
                    {project.featured && (
                      <span className="chip chip-warning">Featured</span>
                    )}
                    {project.tags.map(tag => (
                      <span key={tag} className="chip chip-primary">{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-1 underline-offset-4">
                    <p className="text-text-muted text-sm line-clamp-1 flex-1">{project.description}</p>
                    <span className="text-[10px] text-text-muted flex items-center gap-1 shrink-0">
                      <ImageIcon size={12} /> {project.media?.filter(m => m.type === 'image').length || 0}
                      <Video size={12} className="ml-1" /> {project.media?.filter(m => m.type === 'video').length || 0}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => { setEditing(project); setModalOpen(true) }} className="btn-secondary p-2 flex items-center justify-center">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="btn-secondary p-2 flex items-center justify-center text-error border-error-bg hover:bg-error-bg hover:text-error hover:border-error">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="text-center py-20 text-text-muted">
                <p>No projects yet. Click &ldquo;Add Project&rdquo; to get started.</p>
              </div>
            )}
          </div>
        )}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} project={editing} onSaved={load} />
    </AdminLayout>
  )
}
