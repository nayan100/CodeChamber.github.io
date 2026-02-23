export interface Profile {
  id: string
  name: string
  title: string
  summary: string | null
  email: string | null
  linkedin: string | null
  github: string | null
  location: string | null
  resume_url: string | null
  avatar_url: string | null
  updated_at: string
}

export interface Skill {
  id: string
  category: 'backend' | 'devops' | 'iot_edge' | 'frontend' | 'other'
  name: string
  icon: string | null
  sort_order: number
}

export interface Experience {
  id: string
  role: string
  company: string
  location: string | null
  start_date: string
  end_date: string | null
  current: boolean
  achievements: string[]
  sort_order: number
}

export interface ProjectMedia {
  type: 'image' | 'video'
  url: string
}

export interface Project {
  id: string
  title: string
  description: string | null
  tech_stack: string[]
  tags: string[]
  github_url: string | null
  demo_url: string | null
  image_url: string | null // Still keeping for backward compatibility/main image
  thumbnail_url: string | null
  media: ProjectMedia[]
  architecture_url: string | null
  featured: boolean
  sort_order: number
  created_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  cover_url: string | null
  tags: string[]
  published: boolean
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  created_at: string
}

export type ProjectTag = 'IoT' | 'Backend' | 'AI' | 'DevOps' | 'Frontend'
export type SkillCategory = 'backend' | 'devops' | 'iot_edge' | 'frontend'

export interface AiActionLog {
  id: string
  agent_name: string
  action_type: string
  payload: any
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'EXECUTED' | 'COMPLETED' | 'FAILED'
  executed_at: string | null
  created_at: string
}

export interface AiTaskQueue {
  id: string
  task_type: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  result_payload: any
  created_at: string
}
