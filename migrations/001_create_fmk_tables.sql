-- Daily F/M/K prompts (admin-authored, one per day)
create table fmk_prompts (
  id uuid default uuid_generate_v4() primary key,
  scheduled_date date not null unique,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  created_at timestamp with time zone default now()
);

-- User responses to F/M/K prompts
create table fmk_responses (
  id uuid default uuid_generate_v4() primary key,
  prompt_id uuid references fmk_prompts(id) not null,
  user_id uuid references auth.users(id) not null,
  fuck_choice text not null,
  marry_choice text not null,
  kill_choice text not null,
  created_at timestamp with time zone default now(),
  unique(prompt_id, user_id)
);
