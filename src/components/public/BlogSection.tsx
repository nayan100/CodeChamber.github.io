'use client'
import BlogCard from './BlogCard'
import { Sparkles, BookOpen } from 'lucide-react'
import type { BlogPost } from '@/types'

export default function BlogSection({ posts }: { posts: BlogPost[] }) {
  return (
    <section id="blog" className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="max-w-2xl mb-16 mx-auto text-center flex flex-col items-center">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest w-fit mb-4">
            <Sparkles size={12} />
            Insights & Engineering
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100 dark:text-white mb-6 tracking-tight">
            Knowledge <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 dark:from-indigo-400 to-cyan-600 dark:to-cyan-400">Chamber</span>
          </h2>
          <p className="text-slate-200 dark:text-slate-400 text-lg leading-relaxed">
            Diving deep into IoT architecture, edge computing, and modern full-stack development. 
            Sharing technical deep-dives and engineering principles.
          </p>
        </div>

        {/* Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-40 glass rounded-3xl border border-slate-200 dark:border-slate-800/60 shadow-lg dark:shadow-none">
            <BookOpen size={48} className="mx-auto text-slate-700 dark:text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">The chamber is quiet... for now.</h3>
            <p className="text-slate-500">Check back soon for new articles and engineering insights.</p>
          </div>
        )}
      </div>
    </section>
  )
}
