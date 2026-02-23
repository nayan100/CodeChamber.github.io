'use client'

import { motion } from 'framer-motion'
import { Code2, Server, Cpu, Layout } from 'lucide-react'
import type { Skill } from '@/types'

interface Props {
  skills: Skill[]
}

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

const categories = [
  {
    key: 'backend',
    label: 'Backend',
    icon: Server,
    color: 'from-indigo-500/10 dark:from-indigo-500/20 to-indigo-500/5 dark:to-indigo-500/5',
    border: 'border-indigo-500/20 dark:border-indigo-500/30',
    badge: 'bg-indigo-100 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/20',
    glow: 'shadow-indigo-500/5 dark:shadow-indigo-500/10',
  },
  {
    key: 'devops',
    label: 'DevOps & Cloud',
    icon: Code2,
    color: 'from-violet-500/10 dark:from-violet-500/20 to-violet-500/5 dark:to-violet-500/5',
    border: 'border-violet-500/20 dark:border-violet-500/30',
    badge: 'bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-500/20',
    glow: 'shadow-violet-500/5 dark:shadow-violet-500/10',
  },
  {
    key: 'iot_edge',
    label: 'IoT & Edge',
    icon: Cpu,
    color: 'from-cyan-500/10 dark:from-cyan-500/20 to-cyan-500/5 dark:to-cyan-500/5',
    border: 'border-cyan-500/20 dark:border-cyan-500/30',
    badge: 'bg-cyan-100 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/20',
    glow: 'shadow-cyan-500/5 dark:shadow-cyan-500/10',
  },
  {
    key: 'frontend',
    label: 'Frontend',
    icon: Layout,
    color: 'from-emerald-500/10 dark:from-emerald-500/20 to-emerald-500/5 dark:to-emerald-500/5',
    border: 'border-emerald-500/20 dark:border-emerald-500/30',
    badge: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20',
    glow: 'shadow-emerald-500/5 dark:shadow-emerald-500/10',
  },
]

export default function About({ skills }: Props) {
  return (
    <section id="about" className="section">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="space-y-16"
        >
          {/* Section header */}
          <motion.div variants={fadeInUp} className="text-center space-y-4">
            <p className="text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase text-sm">About Me</p>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">
              Engineering at the{' '}
              <span className="gradient-text">intersection</span> of cloud &amp; edge
            </h2>
          </motion.div>

          {/* Summary */}
          <motion.div variants={fadeInUp} className="max-w-3xl mx-auto">
            <div className="glass rounded-2xl p-8 space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed text-lg shadow-lg dark:shadow-none">
              <p>
                I&apos;m a <strong className="text-slate-900 dark:text-white font-bold">Senior Full Stack Engineer</strong> with deep expertise 
                in building end-to-end systems — from firmware on edge devices to scalable cloud backends 
                and polished frontends.
              </p>
              <p>
                As <strong className="text-slate-900 dark:text-white font-bold">VP of Technology</strong>, I led engineering teams, 
                owned system architecture, and shipped production-grade IoT platforms processing 
                millions of telemetry events daily. I care deeply about{' '}
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">performance</span>,{' '}
                <span className="text-cyan-600 dark:text-cyan-400 font-medium">reliability</span>, and{' '}
                <span className="text-violet-600 dark:text-violet-400 font-medium">developer experience</span>.
              </p>
            </div>
          </motion.div>

          {/* Skills grid */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon
              const catSkills = skills.filter((s) => s.category === cat.key)
              return (
                <motion.div
                  key={cat.key}
                  whileHover={{ scale: 1.01, translateY: -2 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className={`rounded-2xl bg-gradient-to-br ${cat.color} border ${cat.border} p-6 shadow-xl ${cat.glow}`}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`p-2 rounded-xl ${cat.border} border bg-white dark:bg-white/5 shadow-inner dark:shadow-none`}>
                      <Icon className="text-slate-900 dark:text-white" size={20} />
                    </div>
                    <h3 className="text-slate-900 dark:text-white font-bold text-lg">{cat.label}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {catSkills.map((skill) => (
                      <span
                        key={skill.id}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${cat.badge}`}
                      >
                        {skill.name}
                      </span>
                    ))}
                    {catSkills.length === 0 && (
                      <span className="text-slate-500 text-sm">No skills added yet</span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
