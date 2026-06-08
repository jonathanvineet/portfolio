-- Create contact_messages table for storing contact form submissions
create table if not exists public.contact_messages (
  id bigserial primary key,
  name text not null,
  email text not null,
  message text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table public.contact_messages enable row level security;

-- Create policy to allow anonymous users to insert
create policy "Allow anonymous inserts" on public.contact_messages
  for insert
  with check (true);

-- Create policy to prevent anonymous users from reading/updating/deleting
create policy "Allow only authenticated select" on public.contact_messages
  for select
  using (auth.role() = 'authenticated');

-- Create an index on email for faster queries
create index if not exists contact_messages_email_idx on public.contact_messages(email);

-- Create an index on created_at for sorting
create index if not exists contact_messages_created_at_idx on public.contact_messages(created_at desc);
