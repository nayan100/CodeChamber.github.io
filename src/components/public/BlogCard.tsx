'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import type { BlogPost } from '@/types'

export default function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const formattedDate = mounted 
    ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : ''
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="glass rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800/60 hover:border-indigo-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 shadow-lg dark:shadow-none bg-white dark:bg-slate-900 text-left">
          {/* Image Container */}
          <div className="relative h-56 overflow-hidden">
            <img
              src={post.cover_url || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
            
            {/* Tags badge */}
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              {post.tags?.slice(0, 2).map((tag) => (
                <span 
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/20 backdrop-blur-md text-white dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider border border-white/20 dark:border-indigo-500/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-500 text-[11px] font-medium uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <Calendar size={12} className="text-indigo-600 dark:text-indigo-400" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={12} className="text-indigo-600 dark:text-indigo-400" />
                5 min read
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-tight">
              {post.title}
            </h3>
            
            <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed">
              {post.excerpt}
            </p>

            <div className="pt-2 flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-bold group/btn">
              Read Article
              <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
