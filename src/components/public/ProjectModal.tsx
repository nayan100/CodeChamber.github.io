'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Github, ExternalLink, ChevronLeft, ChevronRight, Play, Image as ImageIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { Project, ProjectMedia } from '@/types'

interface Props {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export default function ProjectModal({ project, isOpen, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!project) return null

  const media = project.media && project.media.length > 0 
    ? project.media 
    : (project.image_url ? [{ type: 'image', url: project.image_url } as ProjectMedia] : [])

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev + 1) % media.length)
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative glass rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xl flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/10 dark:bg-black/40 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-black/20 dark:hover:bg-black/60 transition-all border border-black/10 dark:border-white/10"
            >
              <X size={20} />
            </button>

            {/* Media Section */}
            <div className="w-full md:w-3/5 bg-slate-100 dark:bg-slate-950 flex flex-col relative group min-h-[300px] md:min-h-[500px]">
              {media.length > 0 ? (
                <>
                  <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="w-full h-full"
                      >
                        {media[currentIndex].type === 'image' ? (
                          <img
                            src={media[currentIndex].url}
                            alt=""
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <video
                            src={media[currentIndex].url}
                            controls
                            className="w-full h-full object-contain"
                            autoPlay
                            muted
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Navigation Arrows */}
                  {media.length > 1 && (
                    <>
                      <button
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white/50 hover:text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white/50 hover:text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}

                  {/* Indicators */}
                  {media.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 p-1.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/5">
                      {media.map((_, i) => (
                        <button
                          key={i}
                          onClick={(e) => { e.stopPropagation(); setCurrentIndex(i) }}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            i === currentIndex ? 'bg-indigo-500 w-4' : 'bg-white/30 hover:bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-700">
                  <div className="text-center text-slate-500">
                    <ImageIcon size={48} className="mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No media available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="w-full md:w-2/5 p-8 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-l border-slate-200 dark:border-slate-800 flex flex-col">
              <div className="space-y-6 flex-1">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{project.title}</h2>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20 font-bold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold">About Project</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 pt-8 mt-8 border-t border-slate-200 dark:border-slate-800">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-semibold transition-all border border-slate-200 dark:border-slate-700 shadow-lg"
                  >
                    <Github size={18} />
                    Source Code
                  </a>
                )}
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20"
                  >
                    <ExternalLink size={18} />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
