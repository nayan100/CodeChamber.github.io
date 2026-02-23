-- ============================================================
-- PORTFOLIO DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. PROFILE
create table if not exists profile (
  id            uuid primary key default gen_random_uuid(),
  name          text not null default 'Your Name',
  title         text not null default 'Senior Full Stack & Edge Systems Engineer',
  summary       text,
  email         text,
  linkedin      text,
  github        text,
  location      text,
  resume_url    text,
  avatar_url    text,
  updated_at    timestamptz default now()
);

-- Seed initial profile row
insert into profile (name, title, summary, email, linkedin, github, location)
values (
  'Your Name',
  'Senior Full Stack & Edge Systems Engineer',
  'Results-driven engineer with 5+ years building scalable IoT pipelines, edge computing systems, and cloud-native applications. Former VP of Technology with architecture and team leadership experience.',
  'hello@yoursite.com',
  'https://linkedin.com/in/yourprofile',
  'https://github.com/yourusername',
  'Your City, Country'
) on conflict do nothing;

-- 2. SKILLS
create table if not exists skills (
  id          uuid primary key default gen_random_uuid(),
  category    text not null check (category in ('backend','devops','iot_edge','frontend','other')),
  name        text not null,
  icon        text,
  sort_order  int default 0
);

-- Seed skills
insert into skills (category, name, sort_order) values
  ('backend', 'Java', 1), ('backend', 'Node.js', 2), ('backend', 'Python', 3),
  ('backend', 'REST APIs', 4), ('backend', 'GraphQL', 5), ('backend', 'PostgreSQL', 6),
  ('devops', 'Docker', 1), ('devops', 'Kubernetes', 2), ('devops', 'Apache Kafka', 3),
  ('devops', 'AWS', 4), ('devops', 'GCP', 5), ('devops', 'CI/CD', 6),
  ('iot_edge', 'GPS Systems', 1), ('iot_edge', 'IMU Sensors', 2), ('iot_edge', 'Camera Systems', 3),
  ('iot_edge', 'WebRTC', 4), ('iot_edge', 'NVIDIA Jetson', 5), ('iot_edge', 'MQTT', 6),
  ('frontend', 'React', 1), ('frontend', 'Next.js', 2), ('frontend', 'TypeScript', 3),
  ('frontend', 'HTML/CSS', 4), ('frontend', 'Bootstrap', 5), ('frontend', 'Tailwind CSS', 6)
on conflict do nothing;

-- 3. EXPERIENCE
create table if not exists experience (
  id            uuid primary key default gen_random_uuid(),
  role          text not null,
  company       text not null,
  location      text,
  start_date    date not null,
  end_date      date,
  current       boolean default false,
  achievements  text[] default '{}',
  sort_order    int default 0
);

-- Seed sample experience
insert into experience (role, company, location, start_date, current, achievements, sort_order) values
  ('VP of Technology', 'Your Company', 'Your City', '2022-01-01', true, array[
    'Led a 12-person engineering team delivering edge compute and cloud services across 3 product lines',
    'Architected a real-time GPS telemetry pipeline (MQTT → Kafka → TimescaleDB) handling 10k events/sec',
    'Reduced infrastructure cost by 40% via Kubernetes-based container orchestration on GCP',
    'Established DevOps culture: CI/CD pipelines, automated testing, SLOs and incident response'
  ], 1);

-- 4. PROJECTS
create table if not exists projects (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  description      text,
  tech_stack       text[] default '{}',
  tags             text[] default '{}',
  github_url       text,
  demo_url         text,
  image_url        text,
  architecture_url text,
  featured         boolean default false,
  sort_order       int default 0,
  created_at       timestamptz default now()
);

-- Seed sample project
insert into projects (title, description, tech_stack, tags, featured, sort_order) values
  (
    'Edge Telemetry Platform',
    'Real-time IoT telemetry ingestion and visualization platform for fleet management. Processes GPS, IMU, and camera data from NVIDIA Jetson edge nodes via MQTT/Kafka into TimescaleDB, with a React dashboard for live monitoring.',
    array['Python', 'Apache Kafka', 'TimescaleDB', 'MQTT', 'WebRTC', 'React', 'Docker', 'NVIDIA Jetson'],
    array['IoT', 'Backend', 'DevOps'],
    true, 1
  );

-- 5. BLOG POSTS
create table if not exists blog_posts (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text unique not null,
  content     text,
  excerpt     text,
  cover_url   text,
  tags        text[] default '{}',
  published   boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- 6. CONTACT MESSAGES
create table if not exists contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  message     text not null,
  read        boolean default false,
  created_at  timestamptz default now()
);

-- ============================================================
-- ROW-LEVEL SECURITY
-- ============================================================
alter table profile          enable row level security;
alter table skills           enable row level security;
alter table experience       enable row level security;
alter table projects         enable row level security;
alter table blog_posts       enable row level security;
alter table contact_messages enable row level security;

-- Public read access
create policy "Public can read profile"     on profile          for select using (true);
create policy "Public can read skills"      on skills           for select using (true);
create policy "Public can read experience"  on experience       for select using (true);
create policy "Public can read projects"    on projects         for select using (true);
create policy "Public can read blog posts"  on blog_posts       for select using (published = true);

-- Only service role can write (admin API routes use service role key)
-- No need for additional policies — service role bypasses RLS
