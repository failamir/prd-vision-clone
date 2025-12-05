create table public.contact_submissions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text default 'new'::text,
  is_read boolean default false
);

-- Enable RLS
alter table public.contact_submissions enable row level security;

-- Allow public insert (for the contact form)
create policy "Allow public insert"
on public.contact_submissions
for insert
to public
with check (true);

-- Allow admin select/update/delete
create policy "Allow authenticated select"
on public.contact_submissions
for select
to authenticated
using (true);

create policy "Allow authenticated update"
on public.contact_submissions
for update
to authenticated
using (true);

create policy "Allow authenticated delete"
on public.contact_submissions
for delete
to authenticated
using (true);
