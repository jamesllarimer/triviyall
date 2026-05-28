-- Player game history
create table game_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  score integer not null,
  total_questions integer not null,
  question_set_id uuid references question_sets(id),
  answers jsonb,
  played_at timestamp with time zone default now()
);

-- RLS
alter table game_history enable row level security;

create policy "Users can read their own game history"
  on game_history for select
  using (auth.uid() = user_id);

create policy "Users can insert their own game history"
  on game_history for insert
  with check (auth.uid() = user_id);
