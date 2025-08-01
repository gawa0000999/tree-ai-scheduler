-- tasks テーブルのスキーマ定義
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  title text,
  duration_min integer,
  priority integer,
  deadline timestamptz,
  gcal_event_id text
);