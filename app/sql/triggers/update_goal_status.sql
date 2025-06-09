create or replace function update_goal_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  today date := current_date;
begin
  if new.start_date <= today and new.end_date >= today then
    new.status := 'in_progress';
  elsif new.start_date > today then
    new.status := 'scheduled';
  elsif new.end_date < today then
    new.status := 'failed';
  end if;

  return new;
end;
$$;

drop trigger if exists set_goal_status_on_insert on goals;

create trigger set_goal_status_on_insert
before insert on goals
for each row
execute function update_goal_status();
