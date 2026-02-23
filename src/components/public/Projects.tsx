'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ExternalLink, Github, Tag, Search, Maximize2 } from 'lucide-react'
import type { Project, ProjectTag } from '@/types'
import ProjectModal from './ProjectModal'

interface Props {
  projects: Project[]
}

const ALL_TAGS: ProjectTag[] = ['IoT', 'Backend', 'AI', 'DevOps', 'Frontend']

const tagColors: Record<string, string> = {
  IoT: 'bg-cyan-500/10 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/20 dark:border-cyan-500/30',
  Backend: 'bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/20 dark:border-indigo-500/30',
  AI: 'bg-violet-500/10 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/20 dark:border-violet-500/30',
  DevOps: 'bg-orange-500/10 dark:bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/20 dark:border-orange-500/30',
  Frontend: 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 dark:border-emerald-500/30',
}

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Projects({ projects }: Props) {
  const [activeTag, setActiveTag] = useState<ProjectTag | 'All'>('All')
  const [search, setSearch] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const filtered = projects.filter((p) => {
    const matchTag = activeTag === 'All' || p.tags.includes(activeTag)
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.description ?? '').toLowerCase().includes(search.toLowerCase())
    return matchTag && matchSearch
  })

  // Sort projects: featured first, then by sort_order
  const sortedProjects = [...filtered].sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return (a.sort_order || 0) - (b.sort_order || 0)
  })

  return (
    <section id="projects" className="section relative">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="space-y-10"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <p className="text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase text-sm">CodeChamber</p>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">
              Featured <span className="gradient-text">Projects</span>
            </h2>
          </div>

          {/* Filters + Search */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setActiveTag('All')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  activeTag === 'All'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                All
              </button>
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    activeTag === tag
                      ? `${tagColors[tag]} font-semibold`
                      : 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors w-56"
              />
            </div>
          </div>

          {/* Project cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProjects.map((project, i) => (
              <motion.div
                key={project.id}
                variants={fadeInUp}
                custom={i}
                whileHover={{ scale: 1.02, translateY: -3 }}
                transition={{ type: 'spring', stiffness: 250 }}
                className="glass rounded-2xl overflow-hidden group flex flex-col cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/10 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-lg dark:shadow-none"
                onClick={() => setSelectedProject(project)}
              >
                {/* Image / Architecture placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-indigo-900/40 to-slate-900/80 overflow-hidden">
                  {(project.thumbnail_url || project.image_url) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.thumbnail_url || project.image_url || ''}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-2 opacity-40">
                        <div className="grid grid-cols-3 gap-1 mx-auto w-16">
                          {[...Array(9)].map((_, k) => (
                            <div key={k} className={`h-4 rounded-sm ${k % 3 === 1 ? 'bg-indigo-400' : k % 2 === 0 ? 'bg-cyan-500' : 'bg-slate-600'}`} />
                          ))}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-tighter">Architecture</p>
                      </div>
                    </div>
                  )}
                  
                  {/* View Details Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white text-sm font-semibold translate-y-2 group-hover:translate-y-0 transition-transform">
                      <Maximize2 size={16} />
                      View Details
                    </div>
                  </div>

                  {/* Feature badge */}
                  {project.featured && (
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md shadow-lg shadow-amber-500/10">
                        Featured
                      </span>
                    </div>
                  )}

                  {/* Tag badges on image */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 focus-within:z-10">
                    {project.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border shadow-lg ${tagColors[tag] ?? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'} backdrop-blur-md`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-slate-900 dark:text-white font-bold text-lg leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex-1 line-clamp-2">
                      {project.description ?? 'No description provided.'}
                    </p>
                  </div>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {project.tech_stack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech_stack.length > 4 && (
                      <span className="text-[10px] text-slate-500 font-medium">+{project.tech_stack.length - 4}</span>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex gap-4 pt-2" onClick={(e) => e.stopPropagation()}>
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <Github size={14} />
                        GitHub
                      </a>
                    )}
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
                      >
                        <ExternalLink size={14} />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full text-center py-24 text-slate-500 glass rounded-3xl border border-slate-200 dark:border-slate-800/50">
                <Tag size={40} className="mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium text-slate-600 dark:text-slate-400">No projects match your filter.</p>
                <button onClick={() => { setActiveTag('All'); setSearch('') }} className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-semibold">Clear all filters</button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  )
}
