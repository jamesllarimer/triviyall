-- Enable RLS on game_history and allow users to read/insert their own rows
alter table game_history enable row level security;

create policy "Users can read their own game history"
  on game_history for select
  using (auth.uid() = user_id);

create policy "Users can insert their own game history"
  on game_history for insert
  with check (auth.uid() = user_id);

-- Enable RLS on fmk_responses and allow users to manage their own responses
alter table fmk_responses enable row level security;

create policy "Users can read all fmk responses"
  on fmk_responses for select
  using (true);

create policy "Users can insert their own fmk response"
  on fmk_responses for insert
  with check (auth.uid() = user_id);

-- Allow authenticated users to read fmk_prompts
alter table fmk_prompts enable row level security;

create policy "Authenticated users can read fmk prompts"
  on fmk_prompts for select
  using (auth.role() = 'authenticated');
