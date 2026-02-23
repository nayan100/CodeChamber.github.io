'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { supabase } from '@/lib/supabase/client'
import { saveBlogPost, deleteBlogPost, getBlogPosts } from '@/lib/actions'
import { Plus, Pencil, Trash2, X, Loader2, Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import type { BlogPost } from '@/types'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, hyphens'),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  cover_url: z.string().optional(),
  tags: z.string().optional(),
  published: z.boolean().optional(),
})
type FormData = z.infer<typeof schema>

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function Modal({ open, onClose, post, onSaved }: { open: boolean; onClose: () => void; post: BlogPost | null; onSaved: () => void }) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({ 
    resolver: zodResolver(schema) 
  })
  const title = watch('title')

  useEffect(() => {
    if (post) {
      reset({ 
        title: post.title, 
        slug: post.slug, 
        excerpt: post.excerpt ?? '', 
        content: post.content ?? '', 
        cover_url: post.cover_url ?? '', 
        tags: post.tags?.join(', ') ?? '',
        published: post.published 
      })
    } else {
      reset({ title: '', slug: '', excerpt: '', content: '', cover_url: '', tags: '', published: false })
    }
  }, [post, reset, open])

  // Auto-generate slug from title
  useEffect(() => {
    if (!post && title) setValue('slug', slugify(title))
  }, [title, post, setValue])

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        id: post?.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || null,
        content: data.content || null,
        cover_url: data.cover_url || null,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        published: data.published ?? false,
      }

      await saveBlogPost(payload)
      toast.success(post ? 'Post updated!' : 'Post created!')
      onSaved()
      onClose()
    } catch (err: any) {
      toast.error(err.message || 'Failed to save post')
    }
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-white font-bold text-lg">{post ? 'Edit Post' : 'New Blog Post'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Title *</label>
            <input {...register('title')} placeholder="Building a Real-Time GPS Pipeline" className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm" />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Slug *</label>
            <input {...register('slug')} placeholder="building-realtime-gps-pipeline" className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm font-mono" />
            {errors.slug && <p className="text-red-400 text-xs mt-1">{errors.slug.message}</p>}
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Excerpt</label>
            <input {...register('excerpt')} placeholder="A short summary shown in listings..." className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Cover Image URL</label>
            <input {...register('cover_url')} placeholder="https://..." className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Tags (comma separated)</label>
            <input {...register('tags')} placeholder="Next.js, Tailwind, IoT" className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Content (Markdown / HTML)</label>
            <textarea {...register('content')} rows={10} placeholder="Write your blog post here..." className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm resize-y font-mono" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('published')} className="rounded accent-indigo-600" />
            <span className="text-sm text-slate-300">Published (visible on site)</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-sm">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all">
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {post ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await getBlogPosts()
      setPosts(data ?? [])
    } catch (err: any) {
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [])

  const togglePublish = async (post: BlogPost) => {
    try {
      await saveBlogPost({ id: post.id, published: !post.published })
      toast.success(post.published ? 'Unpublished' : 'Published!')
      load()
    } catch (err: any) {
      toast.error(err.message || 'Failed to toggle publish')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return
    try {
      await deleteBlogPost(id)
      toast.success('Post deleted')
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
            <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
            <p className="text-slate-400 text-sm mt-1">{posts.length} posts · {posts.filter(p => p.published).length} published</p>
          </div>
          <button onClick={() => { setEditing(null); setModalOpen(true) }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20">
            <Plus size={16} /> New Post
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-slate-600" /></div>
        ) : (
          <div className="space-y-3">
            {posts.map(post => (
              <div key={post.id} className="glass rounded-xl p-5 border border-slate-800 flex items-start gap-4 hover:border-slate-700 transition-all">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-white font-semibold">{post.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${post.published ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-slate-700/50 text-slate-400 border-slate-700'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-1 font-mono">/{post.slug}</p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1 no-scrollbar">
                      {post.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {post.excerpt && <p className="text-slate-400 text-sm mt-2 line-clamp-2 leading-relaxed">{post.excerpt}</p>}
                  <p className="text-slate-600 text-[11px] mt-2 font-medium uppercase tracking-wider">
                    Created {new Date(post.created_at).toLocaleDateString('en-US', { dateStyle: 'long' })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => togglePublish(post)} className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all" title={post.published ? 'Unpublish' : 'Publish'}>
                    {post.published ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button onClick={() => { setEditing(post); setModalOpen(true) }} className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-all"><Pencil size={15} /></button>
                  <button onClick={() => handleDelete(post.id)} className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
            {posts.length === 0 && <div className="text-center py-20 text-slate-500">No blog posts yet. Write your first post!</div>}
          </div>
        )}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} post={editing} onSaved={load} />
    </AdminLayout>
  )
}
