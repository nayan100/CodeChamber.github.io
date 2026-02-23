'use client'

import { motion } from 'framer-motion'
import { Crown, Users, Network, Lightbulb } from 'lucide-react'

const highlights = [
  {
    icon: Crown,
    title: 'VP of Technology',
    desc: 'Held VP role with full ownership of engineering roadmap, team structure, and technical strategy across multiple product lines.',
  },
  {
    icon: Network,
    title: 'System Architecture',
    desc: 'Architected distributed IoT platforms, real-time telemetry pipelines, and cloud-native microservices from the ground up.',
  },
  {
    icon: Users,
    title: 'Team Leadership',
    desc: 'Built and mentored high-performing engineering teams. Established engineering culture, code standards, and agile practices.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation Mindset',
    desc: 'Spearheaded adoption of edge AI (NVIDIA Jetson), WebRTC live-streaming, and event-driven architecture across products.',
  },
]

export default function Leadership() {
  return (
    <section id="leadership" className="section bg-slate-50 dark:bg-slate-900/30">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <p className="text-amber-700 dark:text-amber-400 font-semibold tracking-wider uppercase text-sm">Leadership</p>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">
              <span className="text-amber-700 dark:text-amber-400">Executive</span> Engineering Background
            </h2>
            <p className="text-slate-800 dark:text-slate-400 max-w-xl mx-auto font-medium">
              Beyond writing code — leading teams, defining architecture, and driving engineering culture.
            </p>
          </div>

          {/* Highlight cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {highlights.map((item, i) => {
              const Icon = item.icon
              return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.02, translateY: -2 }}
                    className="glass rounded-2xl p-6 border border-amber-600/20 dark:border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/5 shadow-lg dark:shadow-amber-500/5 text-left"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-xl bg-amber-600/10 dark:bg-amber-500/20 border border-amber-600/20 dark:border-amber-500/30 shrink-0">
                        <Icon className="text-amber-700 dark:text-amber-400" size={20} />
                      </div>
                      <div>
                        <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-1">{item.title}</h3>
                        <p className="text-slate-800 dark:text-slate-400 text-sm leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
