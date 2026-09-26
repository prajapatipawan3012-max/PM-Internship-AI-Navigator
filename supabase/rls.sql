-- Run this in the Supabase SQL Editor after creating a Clerk JWT template
-- named "supabase". The template must include the standard Clerk `sub` claim.

alter table public.profiles enable row level security;
alter table public.skills enable row level security;
alter table public.resumes enable row level security;
alter table public.ai_analysis enable row level security;
alter table public.saved_internships enable row level security;
alter table public.internships enable row level security;

drop policy if exists "profiles owner access" on public.profiles;
create policy "profiles owner access" on public.profiles
  for all to authenticated
  using (user_id = (auth.jwt() ->> 'sub'))
  with check (user_id = (auth.jwt() ->> 'sub'));

drop policy if exists "skills owner access" on public.skills;
create policy "skills owner access" on public.skills
  for all to authenticated
  using (exists (
    select 1 from public.profiles p
    where p.id = skills.profile_id and p.user_id = (auth.jwt() ->> 'sub')
  ))
  with check (exists (
    select 1 from public.profiles p
    where p.id = skills.profile_id and p.user_id = (auth.jwt() ->> 'sub')
  ));

drop policy if exists "resumes owner access" on public.resumes;
create policy "resumes owner access" on public.resumes
  for all to authenticated
  using (user_id = (auth.jwt() ->> 'sub'))
  with check (user_id = (auth.jwt() ->> 'sub'));

drop policy if exists "ai analysis owner access" on public.ai_analysis;
create policy "ai analysis owner access" on public.ai_analysis
  for all to authenticated
  using (exists (
    select 1 from public.profiles p
    where p.id = ai_analysis.profile_id and p.user_id = (auth.jwt() ->> 'sub')
  ))
  with check (exists (
    select 1 from public.profiles p
    where p.id = ai_analysis.profile_id and p.user_id = (auth.jwt() ->> 'sub')
  ));

drop policy if exists "saved internships owner access" on public.saved_internships;
create policy "saved internships owner access" on public.saved_internships
  for all to authenticated
  using (exists (
    select 1 from public.profiles p
    where p.id = saved_internships.profile_id and p.user_id = (auth.jwt() ->> 'sub')
  ))
  with check (exists (
    select 1 from public.profiles p
    where p.id = saved_internships.profile_id and p.user_id = (auth.jwt() ->> 'sub')
  ));

drop policy if exists "internships public read" on public.internships;
create policy "internships public read" on public.internships
  for select to anon, authenticated using (true);

-- Storage paths are written as: <clerk-user-id>/<profile-id>/<filename>
drop policy if exists "resume storage owner access" on storage.objects;
create policy "resume storage owner access" on storage.objects
  for all to authenticated
  using (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = (auth.jwt() ->> 'sub')
  )
  with check (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = (auth.jwt() ->> 'sub')
  );
