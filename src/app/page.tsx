export const dynamic = 'force-dynamic'

import { supabaseAdmin } from '@/lib/supabase/server'
import Hero from '@/components/public/Hero'
import About from '@/components/public/About'
import ExperienceSection from '@/components/public/Experience'
import Projects from '@/components/public/Projects'
import Leadership from '@/components/public/Leadership'
import Contact from '@/components/public/Contact'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import BlogSection from '@/components/public/BlogSection'
import { getBlogPosts } from '@/lib/actions'
import type { Profile, Skill, Experience, Project, BlogPost } from '@/types'

// Server Component — fetch all data at render time
async function getData() {
  const [profileRes, skillsRes, experienceRes, projectsRes, blogRes] = await Promise.all([
    supabaseAdmin.from('profile').select('*').single(),
    supabaseAdmin.from('skills').select('*').order('sort_order'),
    supabaseAdmin.from('experience').select('*').order('sort_order'),
    supabaseAdmin.from('projects').select('*').order('sort_order'),
    getBlogPosts(true), // Fetch only published posts
  ])

  return {
    profile: (profileRes.data ?? null) as Profile | null,
    skills: (skillsRes.data ?? []) as Skill[],
    experiences: (experienceRes.data ?? []) as Experience[],
    projects: (projectsRes.data ?? []) as Project[],
    posts: (blogRes ?? []) as BlogPost[],
  }
}

export default async function HomePage() {
  const { profile, skills, experiences, projects, posts } = await getData()

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About skills={skills} />
        <ExperienceSection experiences={experiences} />
        <Projects projects={projects} />
        <BlogSection posts={posts} />
        <Leadership />
        <Contact profile={profile} />
      </main>
      <Footer />
    </>
  )
}
