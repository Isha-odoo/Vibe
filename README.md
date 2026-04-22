# Chat App (Supabase)

## Setup

1. Create tables:

create extension if not exists "uuid-ossp";

create table profiles (
  id uuid primary key references auth.users(id),
  email text
);

create table messages (
  id uuid primary key default uuid_generate_v4(),
  sender uuid,
  receiver uuid,
  content text,
  created_at timestamp default now()
);

2. Enable Realtime for messages

3. Add RLS policies

4. Open index.html
