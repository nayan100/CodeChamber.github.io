import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import { getBlogPostBySlug } from '@/lib/actions'
import { notFound } from 'next/navigation'
import { Calendar, Clock, Tag, User, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post || !post.published) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 selection:bg-indigo-500/30">
      <Navbar />

      <main className="pt-32 pb-20">
        <article className="container mx-auto px-6 max-w-4xl">
          {/* Top Navigation */}
          <Link 
            href="/#blog" 
            className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-medium transition-colors mb-8 group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to Chamber
          </Link>

          {/* Hero Section */}
          <header className="mb-12">
            <div className="flex flex-wrap gap-4 items-center text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Calendar size={14} className="text-indigo-600 dark:text-indigo-400" />
                {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <Clock size={14} />
                8 min read
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight mb-8">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic border-l-4 border-indigo-500 pl-6">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Featured Image */}
          {post.cover_url && (
            <div className="relative aspect-video rounded-3xl overflow-hidden mb-16 border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl">
              <img 
                src={post.cover_url} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 dark:from-slate-950/40 via-transparent to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-slate dark:prose-invert prose-indigo max-w-none">
            <div 
              className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg space-y-6 blog-content"
              dangerouslySetInnerHTML={{ __html: post.content || '' }} 
            />
          </div>

          {/* Footer Metadata */}
          <footer className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
                  NH
                </div>
                <div>
                  <p className="text-slate-900 dark:text-white font-bold">Nayan Moni Hazarika</p>
                  <p className="text-slate-500 dark:text-slate-500 text-sm">IoT & Full-Stack Architect</p>
                </div>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </footer>
        </article>
      </main>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        .blog-content h2 { color: inherit; font-size: 1.875rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; }
        .blog-content h3 { color: inherit; font-size: 1.5rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; }
        .dark .blog-content h2, .dark .blog-content h3 { color: white; }
        .blog-content p { margin-bottom: 1.5rem; }
        .blog-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; }
        .blog-content li { margin-bottom: 0.5rem; }
        .blog-content code { background-color: #f1f5f9; padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-size: 0.875em; color: #4f46e5; }
        .dark .blog-content code { background-color: #1e293b; color: #818cf8; }
        .blog-content pre { background-color: #f8fafc; padding: 1.5rem; border-radius: 1rem; overflow-x: auto; margin-bottom: 1.5rem; border: 1px solid #e2e8f0; }
        .dark .blog-content pre { background-color: #0f172a; border: 1px solid #1e293b; }
        .blog-content blockquote { border-left: 4px solid #6366f1; padding-left: 1.5rem; font-style: italic; color: #64748b; margin-bottom: 1.5rem; }
        .dark .blog-content blockquote { color: #94a3b8; }
      `}} />
    </div>
  )
}
