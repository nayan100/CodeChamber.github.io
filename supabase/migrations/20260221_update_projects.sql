-- Add thumbnail and media support to projects
alter table projects add column if not exists thumbnail_url text;
alter table projects add column if not exists media jsonb default '[]'::jsonb;

-- Comment for clarity
comment on column projects.media is 'Array of {type: "image" | "video", url: string}';
