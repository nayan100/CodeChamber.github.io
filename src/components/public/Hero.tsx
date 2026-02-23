'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowDown, Download, Mail, FolderGit2 } from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient mesh */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl opacity-50 dark:opacity-100" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl opacity-50 dark:opacity-100" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl opacity-30 dark:opacity-100" />
      </div>

      <div className="container mx-auto px-6 max-w-5xl text-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Status pill */}
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
              </span>
              Available for Senior / Lead roles
            </span>
          </motion.div>

          {/* Name & Subtitle */}
          <motion.div variants={fadeInUp} className="space-y-2">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">
              Code<span className="gradient-text">Chamber</span>
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] animate-pulse">
              created by Nayan moni hazarika
            </p>
          </motion.div>

          {/* Title */}
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl md:text-3xl font-bold text-slate-800 dark:text-slate-200"
          >
            Senior Full Stack &amp; Edge Systems Engineer
          </motion.p>

          {/* Professional Summary */}
          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg md:text-xl text-slate-800 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-light"
          >
            5+ years building <span className="text-slate-900 dark:text-white font-normal">real-time IoT pipelines</span>, 
            <span className="text-slate-900 dark:text-white font-normal"> scalable backend architectures</span>, and 
            <span className="text-slate-900 dark:text-white font-normal"> edge AI systems</span>. 
            Former VP of Technology leading architecture, product direction, and high-impact engineering teams.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap gap-3 sm:gap-4 justify-center items-center pt-8"
          >
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold transition-all duration-300 hover:bg-slate-800 dark:hover:bg-slate-200 hover:-translate-y-1 shadow-lg dark:shadow-2xl dark:shadow-white/10"
            >
              <Download size={18} />
              <span className="text-sm sm:text-base">Download Resume</span>
            </a>
            <Link
              href="#projects"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1"
            >
              <FolderGit2 size={18} />
              <span className="text-sm sm:text-base">View Projects</span>
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-indigo-600 border border-indigo-500 text-white font-bold transition-all duration-300 hover:bg-indigo-500 hover:-translate-y-1 shadow-lg shadow-indigo-600/20"
            >
              <span className="text-sm sm:text-base">Explore Blog</span>
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl border border-slate-400 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold transition-all duration-300 hover:border-slate-600 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-white hover:-translate-y-1"
            >
              <Mail size={18} />
              <span className="text-sm sm:text-base">Contact Me</span>
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            variants={fadeInUp}
            className="pt-16 flex justify-center"
          >
            <Link href="#about" aria-label="Scroll to about section">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="p-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-slate-300 hover:border-indigo-600 dark:hover:border-slate-600 transition-colors cursor-pointer"
              >
                <ArrowDown size={18} />
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
