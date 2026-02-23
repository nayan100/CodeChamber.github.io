'use server'

import { supabaseAdmin } from './supabase/server'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import type { Project, Experience, Skill, BlogPost, ContactMessage } from '@/types'

// Auth helper
async function ensureAuth() {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Unauthenticated')
}

// --- PROJECTS ---
export async function saveProject(project: Partial<Project>) {
  await ensureAuth()
  const isUpdate = !!project.id
  
  const payload = {
    title: project.title,
    description: project.description,
    tech_stack: project.tech_stack,
    tags: project.tags,
    github_url: project.github_url || null,
    demo_url: project.demo_url || null,
    image_url: project.image_url || null,
    thumbnail_url: project.thumbnail_url || null,
    media: project.media || [],
    featured: project.featured,
    sort_order: project.sort_order ?? 0,
  }

  const { data, error } = isUpdate 
    ? await supabaseAdmin.from('projects').update(payload).eq('id', project.id).select().single()
    : await supabaseAdmin.from('projects').insert(payload).select().single()

  if (error) throw new Error(error.message)
  revalidatePath('/admin/projects')
  revalidatePath('/')
  return data
}

export async function deleteProject(id: string) {
  await ensureAuth()
  const { error } = await supabaseAdmin.from('projects').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/projects')
  revalidatePath('/')
}

// --- EXPERIENCE ---
export async function saveExperience(exp: Partial<Experience>) {
  await ensureAuth()
  const isUpdate = !!exp.id
  
  const payload = {
    role: exp.role,
    company: exp.company,
    location: exp.location,
    start_date: exp.start_date,
    end_date: exp.current ? null : exp.end_date,
    current: exp.current,
    achievements: exp.achievements,
    sort_order: exp.sort_order ?? 0,
  }

  const { data, error } = isUpdate
    ? await supabaseAdmin.from('experience').update(payload).eq('id', exp.id).select().single()
    : await supabaseAdmin.from('experience').insert(payload).select().single()

  if (error) throw new Error(error.message)
  revalidatePath('/admin/experience')
  revalidatePath('/')
  return data
}

export async function deleteExperience(id: string) {
  await ensureAuth()
  const { error } = await supabaseAdmin.from('experience').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/experience')
  revalidatePath('/')
}

// --- SKILLS ---
export async function saveSkill(skill: Partial<Skill>) {
  await ensureAuth()
  const isUpdate = !!skill.id
  
  const payload = {
    name: skill.name,
    category: skill.category,
    sort_order: skill.sort_order ?? 0,
  }

  const { data, error } = isUpdate
    ? await supabaseAdmin.from('skills').update(payload).eq('id', skill.id).select().single()
    : await supabaseAdmin.from('skills').insert(payload).select().single()

  if (error) throw new Error(error.message)
  revalidatePath('/admin/skills')
  revalidatePath('/')
  return data
}

export async function deleteSkill(id: string) {
  await ensureAuth()
  const { error } = await supabaseAdmin.from('skills').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/skills')
  revalidatePath('/')
}

// --- BLOG ---
export async function saveBlogPost(post: Partial<BlogPost>) {
  await ensureAuth()
  const isUpdate = !!post.id
  
  const payload = {
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    cover_url: post.cover_url,
    tags: post.tags || [],
    published: post.published,
    updated_at: new Date().toISOString()
  }

  try {
    const { data, error } = isUpdate
      ? await supabaseAdmin.from('blog_posts').update(payload).eq('id', post.id).select().single()
      : await supabaseAdmin.from('blog_posts').insert({ ...payload, created_at: new Date().toISOString() }).select().single()

    if (error) {
      // If error is about missing tags column, retry without it
      if (error.message.includes('tags') || error.code === '42703') {
        const { tags, ...payloadWithoutTags } = payload
        const { data: retryData, error: retryError } = isUpdate
          ? await supabaseAdmin.from('blog_posts').update(payloadWithoutTags).eq('id', post.id).select().single()
          : await supabaseAdmin.from('blog_posts').insert({ ...payloadWithoutTags, created_at: new Date().toISOString() }).select().single()
        
        if (retryError) {
          console.error('saveBlogPost retry error:', retryError)
          throw new Error(retryError.message)
        }
        revalidatePath('/admin/blog')
        revalidatePath('/')
        return retryData
      }
      
      console.error('saveBlogPost error:', error)
      throw new Error(error.message)
    }
    
    revalidatePath('/admin/blog')
    revalidatePath('/')
    return data
  } catch (err: any) {
    console.error('saveBlogPost exception:', err)
    throw err
  }
}

export async function deleteBlogPost(id: string) {
  await ensureAuth()
  const { error } = await supabaseAdmin.from('blog_posts').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  revalidatePath('/')
}

export async function getBlogPosts(onlyPublished: boolean = false) {
  try {
    let query = supabaseAdmin.from('blog_posts').select('*').order('created_at', { ascending: false })
    
    if (onlyPublished) {
      query = query.eq('published', true)
    }

    const { data, error } = await query
    if (error) {
      console.error('getBlogPosts error:', error)
      throw new Error(error.message)
    }
    return data as BlogPost[]
  } catch (err: any) {
    console.error('getBlogPosts exception:', err)
    throw err
  }
}

export async function getBlogPostBySlug(slug: string) {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) return null
  return data as BlogPost
}

// --- MESSAGES ---
export async function getMessages() {
  await ensureAuth()
  const { data, error } = await supabaseAdmin
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw new Error(error.message)
  return data as ContactMessage[]
}

export async function markMessageAsRead(id: string, read: boolean = true) {
  await ensureAuth()
  const { error } = await supabaseAdmin
    .from('contact_messages')
    .update({ read })
    .eq('id', id)
  
  if (error) throw new Error(error.message)
  revalidatePath('/admin/messages')
  revalidatePath('/admin/dashboard')
}

export async function deleteMessage(id: string) {
  await ensureAuth()
  const { error } = await supabaseAdmin
    .from('contact_messages')
    .delete()
    .eq('id', id)
  
  if (error) throw new Error(error.message)
  revalidatePath('/admin/messages')
  revalidatePath('/admin/dashboard')
}

// --- AI AUTOMATION ---

export async function getAiActionLogs() {
  await ensureAuth()
  const { data, error } = await supabaseAdmin
    .from('ai_action_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)
  
  if (error) throw new Error(error.message)
  return data
}

export async function updateAiActionStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'EXECUTED') {
  await ensureAuth()
  const { error } = await supabaseAdmin
    .from('ai_action_logs')
    .update({ status })
    .eq('id', id)
  
  if (error) throw new Error(error.message)
  revalidatePath('/admin/ai')
}

export async function triggerAiTask(task_type: string, payload: any = {}) {
  await ensureAuth()
  const { error } = await supabaseAdmin
    .from('ai_task_queue')
    .insert({
      task_type,
      status: 'PENDING',
      result_payload: payload
    })
  
  if (error) throw new Error(error.message)
  revalidatePath('/admin/ai')
}
