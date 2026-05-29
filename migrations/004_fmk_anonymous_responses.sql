-- Allow anonymous (guest) FMK responses by making user_id nullable
alter table fmk_responses alter column user_id drop not null;

-- Drop the old unique constraint (null != null in postgres, so it already
-- allows multiple anonymous rows, but be explicit about the policy intent)
alter table fmk_responses drop constraint if exists fmk_responses_prompt_id_user_id_key;

-- Re-add unique constraint only for authenticated users (partial index)
create unique index fmk_responses_prompt_user_unique
  on fmk_responses (prompt_id, user_id)
  where user_id is not null;

-- Replace the insert policy to allow both authenticated and anonymous inserts
drop policy if exists "Users can insert their own fmk response" on fmk_responses;

create policy "Anyone can insert an fmk response"
  on fmk_responses for insert
  with check (
    (auth.uid() is not null and auth.uid() = user_id) or
    (auth.uid() is null and user_id is null)
  );
