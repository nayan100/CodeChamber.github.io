
-- Add tags column to blog_posts if it doesn't exist
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name='blog_posts' and column_name='tags') then
    alter table blog_posts add column tags text[] default '{}';
  end if;
end $$;

-- Update RLS to allow public to read only published posts (already there, but ensuring it)
-- drop policy if exists "Public can read blog posts" on blog_posts;
-- create policy "Public can read blog posts" on blog_posts for select using (published = true);

-- Add a policy for the service role (implicit) or just ensure it works.
-- Actually, the best way for the admin dashboard to see drafts is to use the service role key on the server.
