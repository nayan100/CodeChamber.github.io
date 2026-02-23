export const dynamic = 'force-dynamic'

import { authOptions } from '@/lib/auth'
import AdminLayout from '@/components/admin/AdminLayout'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase/server'
import { FolderGit2, Briefcase, BookOpen, Mail } from 'lucide-react'

async function getStats() {
  const [projectsRes, experienceRes, blogRes, messagesRes] = await Promise.all([
    supabaseAdmin.from('projects').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('experience').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('blog_posts').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('contact_messages').select('id', { count: 'exact', head: true }).eq('read', false),
  ])
  return {
    projects: projectsRes.count ?? 0,
    experience: experienceRes.count ?? 0,
    blog: blogRes.count ?? 0,
    messages: messagesRes.count ?? 0,
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const stats = await getStats()

  const cards = [
    { label: 'Projects', value: stats.projects, icon: FolderGit2, href: '/admin/projects', colorClass: 'text-primary bg-primary/10' },
    { label: 'Experience Entries', value: stats.experience, icon: Briefcase, href: '/admin/experience', colorClass: 'text-info-text bg-info-bg' },
    { label: 'Blog Posts', value: stats.blog, icon: BookOpen, href: '/admin/blog', colorClass: 'text-accent bg-accent/10' },
    { label: 'Unread Messages', value: stats.messages, icon: Mail, href: '/admin/messages', colorClass: 'text-warning-text bg-warning-bg' },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-text-heading">Dashboard</h1>
          <p className="text-text-muted text-sm mt-1">Welcome back! Here&apos;s an overview of your portfolio.</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(({ label, value, icon: Icon, href, colorClass }) => (
            <a
              key={label}
              href={href}
              className={`elevated-surface p-6 hover:-translate-y-1 transition-transform group`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-text-muted text-sm font-medium">{label}</span>
                <div className={`p-2.5 rounded-xl ${colorClass}`}>
                  <Icon size={20} />
                </div>
              </div>
              <p className="text-4xl font-bold text-text-heading group-hover:text-primary transition-colors">{value}</p>
            </a>
          ))}
        </div>

        {/* Quick actions */}
        <div className="elevated-surface p-6">
          <h2 className="text-text-heading font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { href: '/admin/projects', label: '+ Add Project' },
              { href: '/admin/experience', label: '+ Add Experience' },
              { href: '/admin/blog', label: '+ New Blog Post' },
              { href: '/admin/skills', label: 'Manage Skills' },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="btn-secondary text-sm"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
