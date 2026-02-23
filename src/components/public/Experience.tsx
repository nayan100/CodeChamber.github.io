'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, MapPin, Calendar, CheckCircle2 } from 'lucide-react'
import type { Experience } from '@/types'

interface Props {
  experiences: Experience[]
}

const fadeInUp = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
}

export default function ExperienceSection({ experiences }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  function formatDate(dateStr: string | null, current: boolean) {
    if (current) return 'Present'
    if (!dateStr) return '—'
    if (!mounted) return ''
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
  return (
    <section id="experience" className="section bg-slate-50 dark:bg-slate-900/30">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="space-y-12"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <p className="text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase text-sm">Career</p>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">
              Work <span className="gradient-text">Experience</span>
            </h2>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 via-slate-200 dark:via-slate-700 to-transparent" />

            <div className="space-y-8">
              {experiences.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  variants={fadeInUp}
                  custom={i}
                  className="relative pl-16"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-[18px] top-6 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-slate-950" />

                  <div className="glass rounded-2xl p-6 hover:border-slate-600/50 transition-all duration-300 space-y-4">
                    {/* Role + company */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{exp.role}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium">
                          <Briefcase size={14} />
                          {exp.company}
                        </span>
                        {exp.location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin size={14} />
                            {exp.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          {formatDate(exp.start_date, false)} — {formatDate(exp.end_date, exp.current)}
                        </span>
                        {exp.current && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-xs font-medium">
                            Current
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Achievements */}
                    {exp.achievements.length > 0 && (
                      <ul className="space-y-2">
                        {exp.achievements.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed"
                          >
                            <CheckCircle2
                              size={16}
                              className="text-cyan-600 dark:text-cyan-400 mt-0.5 shrink-0"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              ))}

              {experiences.length === 0 && (
                <p className="text-slate-500 text-center py-8">
                  Experience will appear here once added in the admin panel.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
