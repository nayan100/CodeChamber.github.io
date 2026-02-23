'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, Briefcase, FolderGit2, Zap, BookOpen, Mail,
  LogOut, Menu, X, ExternalLink, ChevronRight, Bot
} from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/projects', icon: FolderGit2, label: 'Projects' },
  { href: '/admin/experience', icon: Briefcase, label: 'Experience' },
  { href: '/admin/skills', icon: Zap, label: 'Skills' },
  { href: '/admin/blog', icon: BookOpen, label: 'Blog Posts' },
  { href: '/admin/messages', icon: Mail, label: 'Messages' },
  { href: '/admin/ai', icon: Bot, label: 'AI Control Center' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border flex flex-col transition-transform duration-300
          md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-border">
          <span className="text-text-heading font-bold text-lg">
            CodeChamber <span className="text-primary">Admin</span>
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-text-muted hover:text-text-heading"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                    : 'text-text-muted hover:bg-surface-2 hover:text-text-heading'
                }`}
              >
                <Icon size={17} />
                {label}
                {active && <ChevronRight size={14} className="ml-auto text-primary" />}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-text-muted hover:text-text-heading text-sm transition-colors"
          >
            <ExternalLink size={16} /> View Site
          </a>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-text-muted hover:text-error text-sm transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-xl border-b border-border flex items-center px-6 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-text-muted hover:text-text-heading"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <span className="text-text-muted text-sm">Admin</span>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
            A
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
