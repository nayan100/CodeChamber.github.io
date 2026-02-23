import Link from 'next/link'
import { Github, Linkedin, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Code<span className="gradient-text">Chamber</span>
              </span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Excellence in Full Stack & Edge Engineering. Building the future of IoT, real-time systems, and scalable cloud architectures.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Github, href: 'https://github.com/nayan100' },
                { icon: Linkedin, href: 'https://linkedin.com/in/nayan-das-7a1b4b1a4' },
                { icon: Twitter, href: '#' },
              ].map((social, i) => {
                const Icon = social.icon
                return (
                  <a 
                    key={i}
                    href={social.href} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/50 transition-all bg-white dark:bg-transparent shadow-sm dark:shadow-none"
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-6">Navigation</h4>
            <ul className="space-y-4 text-sm font-medium">
              {[
                { label: 'About', href: '#about' },
                { label: 'Experience', href: '#experience' },
                { label: 'Projects', href: '#projects' },
                { label: 'Blog', href: '#blog' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <a href="mailto:hello@codechamber.com" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
                  <Mail size={14} className="text-indigo-600 dark:text-indigo-400" />
                  hello@codechamber.com
                </a>
              </li>
              <li className="text-slate-600 dark:text-slate-400">
                Palo Alto, CA
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs font-medium">
          <p>© {new Date().getFullYear()} CodeChamber. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-indigo-600 dark:hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-slate-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
