'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail, Linkedin, Github, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Profile } from '@/types'

interface Props {
  profile: Profile | null
}

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})
type FormData = z.infer<typeof schema>

export default function Contact({ profile }: Props) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="section">
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
            <p className="text-primary font-semibold tracking-wider uppercase text-sm">Get in Touch</p>
            <h2 className="text-3xl md:text-5xl font-bold text-text-heading">
              Let&apos;s <span className="gradient-text">Connect</span>
            </h2>
            <p className="text-text-muted max-w-md mx-auto">
              Open to senior engineering roles and consulting opportunities. Drop a message and I&apos;ll respond within 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact links */}
            <div className="space-y-6">
              <div className="elevated-surface rounded-2xl p-8 space-y-6">
                <h3 className="text-text-heading font-bold text-xl">Direct Contact</h3>
                {[
                  { icon: Mail, label: 'Email', href: `mailto:${profile?.email ?? 'hello@codechamber.com'}`, text: profile?.email ?? 'hello@codechamber.com', color: 'text-primary' },
                  { icon: Linkedin, label: 'LinkedIn', href: profile?.linkedin ?? '#', text: 'Connect on LinkedIn', color: 'text-[#0A66C2]' },
                  { icon: Github, label: 'GitHub', href: profile?.github ?? '#', text: 'View my GitHub', color: 'text-text-heading' },
                ].map(({ icon: Icon, label, href, text, color }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl bg-surface-2 border border-border hover:border-text-muted transition-all group"
                  >
                    <div className="p-2.5 rounded-lg bg-background border border-border group-hover:border-text-muted transition-all">
                      <Icon size={18} className={color} />
                    </div>
                    <div>
                      <p className="text-text-muted text-xs uppercase tracking-wider">{label}</p>
                      <p className={`text-sm font-medium ${color}`}>{text}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Contact form */}
            <div className="elevated-surface rounded-2xl p-8">
              <h3 className="text-text-heading font-bold text-xl mb-6">Send a Message</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm text-text-muted mb-1.5 font-medium">Name</label>
                  <input
                    {...register('name')}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text placeholder-text-disabled focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                  {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-text-muted mb-1.5 font-medium">Email</label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="you@company.com"
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text placeholder-text-disabled focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                  {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm text-text-muted mb-1.5 font-medium">Message</label>
                  <textarea
                    {...register('message')}
                    placeholder="Tell me about the opportunity..."
                    rows={5}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text placeholder-text-disabled focus:outline-none focus:border-primary transition-colors text-sm resize-none"
                  />
                  {errors.message && <p className="text-error text-xs mt-1">{errors.message.message}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3 px-6 mt-2"
                >
                  <Send size={17} />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>

                {/* Status messages */}
                {status === 'success' && (
                  <div className="flex items-center gap-2 text-success-text text-sm">
                    <CheckCircle size={16} /> Message sent! I&apos;ll reply within 24 hours.
                  </div>
                )}
                {status === 'error' && (
                  <div className="flex items-center gap-2 text-error text-sm">
                    <AlertCircle size={16} /> Failed to send. Please email me directly.
                  </div>
                )}
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
