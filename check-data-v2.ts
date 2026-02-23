
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function check() {
  console.log('--- BLOG POSTS ---')
  const { data: posts } = await supabase.from('blog_posts').select('id, title, slug')
  posts?.forEach(p => console.log(`[${p.id}] ${p.slug} - ${p.title}`))

  console.log('\n--- PROJECTS ---')
  const { data: projects } = await supabase.from('projects').select('id, title, github_url, demo_url')
  projects?.forEach(p => console.log(`[${p.id}] ${p.title}\n  GH: ${p.github_url}\n  Demo: ${p.demo_url}`))
}

check()
