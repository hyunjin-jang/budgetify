create schema if not exists "drizzle";

create sequence "drizzle"."__drizzle_migrations_id_seq";

create table "drizzle"."__drizzle_migrations" (
    "id" integer not null default nextval('drizzle.__drizzle_migrations_id_seq'::regclass),
    "hash" text not null,
    "created_at" bigint
);


alter sequence "drizzle"."__drizzle_migrations_id_seq" owned by "drizzle"."__drizzle_migrations"."id";

CREATE UNIQUE INDEX __drizzle_migrations_pkey ON drizzle.__drizzle_migrations USING btree (id);

alter table "drizzle"."__drizzle_migrations" add constraint "__drizzle_migrations_pkey" PRIMARY KEY using index "__drizzle_migrations_pkey";


create type "public"."goal_status" as enum ('scheduled', 'in_progress', 'completed', 'failed');

create type "public"."notification_type" as enum ('budget', 'goal', 'expense', 'etc');

create type "public"."role" as enum ('admin', 'user');

create type "public"."setting_method" as enum ('amount', 'income_based');

create table "public"."budget_allocations" (
    "id" uuid not null default gen_random_uuid(),
    "recommendation_id" uuid,
    "category" text not null,
    "amount" bigint not null,
    "created_at" timestamp without time zone not null default now(),
    "updated_at" timestamp without time zone not null default now(),
    "user_id" uuid
);


alter table "public"."budget_allocations" enable row level security;

create table "public"."budget_fixed_expenses" (
    "id" uuid not null default gen_random_uuid(),
    "budget_id" uuid,
    "title" text not null,
    "amount" bigint not null,
    "created_at" timestamp without time zone not null default now(),
    "updated_at" timestamp without time zone not null default now(),
    "user_id" uuid
);


alter table "public"."budget_fixed_expenses" enable row level security;

create table "public"."budget_incomes" (
    "id" uuid not null default gen_random_uuid(),
    "budget_id" uuid,
    "title" text not null,
    "amount" bigint not null,
    "created_at" timestamp without time zone not null default now(),
    "updated_at" timestamp without time zone not null default now(),
    "user_id" uuid
);


alter table "public"."budget_incomes" enable row level security;

create table "public"."budget_recommendations" (
    "id" uuid not null default gen_random_uuid(),
    "budget_id" uuid,
    "title" text not null,
    "description" text not null,
    "savings" bigint not null,
    "saving_ratio" numeric(5,2) not null,
    "created_at" timestamp without time zone not null default now(),
    "updated_at" timestamp without time zone not null default now(),
    "user_id" uuid
);


alter table "public"."budget_recommendations" enable row level security;

create table "public"."budgets" (
    "id" uuid not null default gen_random_uuid(),
    "setting_method" setting_method not null,
    "total_amount" bigint not null,
    "user_id" uuid,
    "created_at" timestamp without time zone not null default now(),
    "updated_at" timestamp without time zone not null default now(),
    "date" timestamp without time zone not null default now()
);


alter table "public"."budgets" enable row level security;

create table "public"."expense_categories" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "user_id" uuid,
    "created_at" timestamp without time zone not null default now(),
    "updated_at" timestamp without time zone not null default now()
);


alter table "public"."expense_categories" enable row level security;

create table "public"."expenses" (
    "id" uuid not null default gen_random_uuid(),
    "amount" bigint not null,
    "date" date not null,
    "category" uuid,
    "user_id" uuid,
    "created_at" timestamp without time zone not null default now(),
    "updated_at" timestamp without time zone not null default now(),
    "description" text not null
);


alter table "public"."expenses" enable row level security;

create table "public"."goals" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "amount" bigint not null,
    "start_date" date not null,
    "end_date" date not null,
    "status" goal_status not null default 'scheduled'::goal_status,
    "user_id" uuid,
    "created_at" timestamp without time zone not null default now(),
    "updated_at" timestamp without time zone not null default now()
);


alter table "public"."goals" enable row level security;

create table "public"."notifications" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "type" notification_type not null,
    "title" text not null,
    "description" text not null,
    "read" boolean not null default false,
    "created_at" timestamp without time zone not null default now()
);


create table "public"."profiles" (
    "id" uuid not null,
    "avatar" text,
    "name" text not null,
    "username" text not null,
    "role" role not null default 'user'::role,
    "created_at" timestamp without time zone not null default now(),
    "updated_at" timestamp without time zone not null default now()
);


CREATE UNIQUE INDEX budget_allocations_pkey ON public.budget_allocations USING btree (id);

CREATE UNIQUE INDEX budget_fixed_expenses_pkey ON public.budget_fixed_expenses USING btree (id);

CREATE UNIQUE INDEX budget_incomes_pkey ON public.budget_incomes USING btree (id);

CREATE UNIQUE INDEX budget_recommendations_pkey ON public.budget_recommendations USING btree (id);

CREATE UNIQUE INDEX budget_recommendations_user_id_unique ON public.budget_recommendations USING btree (user_id);

CREATE UNIQUE INDEX budgets_pkey ON public.budgets USING btree (id);

CREATE UNIQUE INDEX expense_categories_pkey ON public.expense_categories USING btree (id);

CREATE UNIQUE INDEX expenses_pkey ON public.expenses USING btree (id);

CREATE UNIQUE INDEX goals_pkey ON public.goals USING btree (id);

CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX profiles_username_unique ON public.profiles USING btree (username);

alter table "public"."budget_allocations" add constraint "budget_allocations_pkey" PRIMARY KEY using index "budget_allocations_pkey";

alter table "public"."budget_fixed_expenses" add constraint "budget_fixed_expenses_pkey" PRIMARY KEY using index "budget_fixed_expenses_pkey";

alter table "public"."budget_incomes" add constraint "budget_incomes_pkey" PRIMARY KEY using index "budget_incomes_pkey";

alter table "public"."budget_recommendations" add constraint "budget_recommendations_pkey" PRIMARY KEY using index "budget_recommendations_pkey";

alter table "public"."budgets" add constraint "budgets_pkey" PRIMARY KEY using index "budgets_pkey";

alter table "public"."expense_categories" add constraint "expense_categories_pkey" PRIMARY KEY using index "expense_categories_pkey";

alter table "public"."expenses" add constraint "expenses_pkey" PRIMARY KEY using index "expenses_pkey";

alter table "public"."goals" add constraint "goals_pkey" PRIMARY KEY using index "goals_pkey";

alter table "public"."notifications" add constraint "notifications_pkey" PRIMARY KEY using index "notifications_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."budget_allocations" add constraint "budget_allocations_recommendation_id_budget_recommendations_id_" FOREIGN KEY (recommendation_id) REFERENCES budget_recommendations(id) ON DELETE CASCADE not valid;

alter table "public"."budget_allocations" validate constraint "budget_allocations_recommendation_id_budget_recommendations_id_";

alter table "public"."budget_allocations" add constraint "budget_allocations_user_id_profiles_id_fk" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."budget_allocations" validate constraint "budget_allocations_user_id_profiles_id_fk";

alter table "public"."budget_fixed_expenses" add constraint "budget_fixed_expenses_budget_id_budgets_id_fk" FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE not valid;

alter table "public"."budget_fixed_expenses" validate constraint "budget_fixed_expenses_budget_id_budgets_id_fk";

alter table "public"."budget_fixed_expenses" add constraint "budget_fixed_expenses_user_id_profiles_id_fk" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."budget_fixed_expenses" validate constraint "budget_fixed_expenses_user_id_profiles_id_fk";

alter table "public"."budget_incomes" add constraint "budget_incomes_budget_id_budgets_id_fk" FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE not valid;

alter table "public"."budget_incomes" validate constraint "budget_incomes_budget_id_budgets_id_fk";

alter table "public"."budget_incomes" add constraint "budget_incomes_user_id_profiles_id_fk" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."budget_incomes" validate constraint "budget_incomes_user_id_profiles_id_fk";

alter table "public"."budget_recommendations" add constraint "budget_recommendations_budget_id_budgets_id_fk" FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE not valid;

alter table "public"."budget_recommendations" validate constraint "budget_recommendations_budget_id_budgets_id_fk";

alter table "public"."budget_recommendations" add constraint "budget_recommendations_user_id_profiles_id_fk" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."budget_recommendations" validate constraint "budget_recommendations_user_id_profiles_id_fk";

alter table "public"."budget_recommendations" add constraint "budget_recommendations_user_id_unique" UNIQUE using index "budget_recommendations_user_id_unique";

alter table "public"."budgets" add constraint "budgets_user_id_profiles_id_fk" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."budgets" validate constraint "budgets_user_id_profiles_id_fk";

alter table "public"."expense_categories" add constraint "expense_categories_user_id_profiles_id_fk" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."expense_categories" validate constraint "expense_categories_user_id_profiles_id_fk";

alter table "public"."expenses" add constraint "expenses_category_expense_categories_id_fk" FOREIGN KEY (category) REFERENCES expense_categories(id) ON DELETE SET NULL not valid;

alter table "public"."expenses" validate constraint "expenses_category_expense_categories_id_fk";

alter table "public"."expenses" add constraint "expenses_user_id_profiles_id_fk" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."expenses" validate constraint "expenses_user_id_profiles_id_fk";

alter table "public"."goals" add constraint "goals_user_id_profiles_id_fk" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."goals" validate constraint "goals_user_id_profiles_id_fk";

alter table "public"."notifications" add constraint "notifications_user_id_profiles_id_fk" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_user_id_profiles_id_fk";

alter table "public"."profiles" add constraint "profiles_id_users_id_fk" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_users_id_fk";

alter table "public"."profiles" add constraint "profiles_username_unique" UNIQUE using index "profiles_username_unique";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.delete_budget_recommendations_and_allocations()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    DELETE FROM budget_allocations
    WHERE recommendation_id IN (
        SELECT id 
        FROM budget_recommendations 
        WHERE budget_id = OLD.id
    );
    
    DELETE FROM budget_recommendations
    WHERE budget_id = OLD.id;
    
    RETURN OLD;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
begin
    if new.raw_app_meta_data is not null then
        if new.raw_app_meta_data ? 'provider' AND new.raw_app_meta_data ->> 'provider' = 'email' then
            if new.raw_user_meta_data ? 'name' and new.raw_user_meta_data ? 'username' then
                insert into public.profiles (id, name, username, role)
                values (new.id, new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'username', 'user');
            else
                insert into public.profiles (id, name, username, role)
                values (new.id, 'Anonymous', 'mr.' || substr(md5(random()::text), 1, 8), 'user');
            end if;
        end if;
    end if;
    return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_goal_status()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$
;

grant delete on table "public"."budget_allocations" to "anon";

grant insert on table "public"."budget_allocations" to "anon";

grant references on table "public"."budget_allocations" to "anon";

grant select on table "public"."budget_allocations" to "anon";

grant trigger on table "public"."budget_allocations" to "anon";

grant truncate on table "public"."budget_allocations" to "anon";

grant update on table "public"."budget_allocations" to "anon";

grant delete on table "public"."budget_allocations" to "authenticated";

grant insert on table "public"."budget_allocations" to "authenticated";

grant references on table "public"."budget_allocations" to "authenticated";

grant select on table "public"."budget_allocations" to "authenticated";

grant trigger on table "public"."budget_allocations" to "authenticated";

grant truncate on table "public"."budget_allocations" to "authenticated";

grant update on table "public"."budget_allocations" to "authenticated";

grant delete on table "public"."budget_allocations" to "service_role";

grant insert on table "public"."budget_allocations" to "service_role";

grant references on table "public"."budget_allocations" to "service_role";

grant select on table "public"."budget_allocations" to "service_role";

grant trigger on table "public"."budget_allocations" to "service_role";

grant truncate on table "public"."budget_allocations" to "service_role";

grant update on table "public"."budget_allocations" to "service_role";

grant delete on table "public"."budget_fixed_expenses" to "anon";

grant insert on table "public"."budget_fixed_expenses" to "anon";

grant references on table "public"."budget_fixed_expenses" to "anon";

grant select on table "public"."budget_fixed_expenses" to "anon";

grant trigger on table "public"."budget_fixed_expenses" to "anon";

grant truncate on table "public"."budget_fixed_expenses" to "anon";

grant update on table "public"."budget_fixed_expenses" to "anon";

grant delete on table "public"."budget_fixed_expenses" to "authenticated";

grant insert on table "public"."budget_fixed_expenses" to "authenticated";

grant references on table "public"."budget_fixed_expenses" to "authenticated";

grant select on table "public"."budget_fixed_expenses" to "authenticated";

grant trigger on table "public"."budget_fixed_expenses" to "authenticated";

grant truncate on table "public"."budget_fixed_expenses" to "authenticated";

grant update on table "public"."budget_fixed_expenses" to "authenticated";

grant delete on table "public"."budget_fixed_expenses" to "service_role";

grant insert on table "public"."budget_fixed_expenses" to "service_role";

grant references on table "public"."budget_fixed_expenses" to "service_role";

grant select on table "public"."budget_fixed_expenses" to "service_role";

grant trigger on table "public"."budget_fixed_expenses" to "service_role";

grant truncate on table "public"."budget_fixed_expenses" to "service_role";

grant update on table "public"."budget_fixed_expenses" to "service_role";

grant delete on table "public"."budget_incomes" to "anon";

grant insert on table "public"."budget_incomes" to "anon";

grant references on table "public"."budget_incomes" to "anon";

grant select on table "public"."budget_incomes" to "anon";

grant trigger on table "public"."budget_incomes" to "anon";

grant truncate on table "public"."budget_incomes" to "anon";

grant update on table "public"."budget_incomes" to "anon";

grant delete on table "public"."budget_incomes" to "authenticated";

grant insert on table "public"."budget_incomes" to "authenticated";

grant references on table "public"."budget_incomes" to "authenticated";

grant select on table "public"."budget_incomes" to "authenticated";

grant trigger on table "public"."budget_incomes" to "authenticated";

grant truncate on table "public"."budget_incomes" to "authenticated";

grant update on table "public"."budget_incomes" to "authenticated";

grant delete on table "public"."budget_incomes" to "service_role";

grant insert on table "public"."budget_incomes" to "service_role";

grant references on table "public"."budget_incomes" to "service_role";

grant select on table "public"."budget_incomes" to "service_role";

grant trigger on table "public"."budget_incomes" to "service_role";

grant truncate on table "public"."budget_incomes" to "service_role";

grant update on table "public"."budget_incomes" to "service_role";

grant delete on table "public"."budget_recommendations" to "anon";

grant insert on table "public"."budget_recommendations" to "anon";

grant references on table "public"."budget_recommendations" to "anon";

grant select on table "public"."budget_recommendations" to "anon";

grant trigger on table "public"."budget_recommendations" to "anon";

grant truncate on table "public"."budget_recommendations" to "anon";

grant update on table "public"."budget_recommendations" to "anon";

grant delete on table "public"."budget_recommendations" to "authenticated";

grant insert on table "public"."budget_recommendations" to "authenticated";

grant references on table "public"."budget_recommendations" to "authenticated";

grant select on table "public"."budget_recommendations" to "authenticated";

grant trigger on table "public"."budget_recommendations" to "authenticated";

grant truncate on table "public"."budget_recommendations" to "authenticated";

grant update on table "public"."budget_recommendations" to "authenticated";

grant delete on table "public"."budget_recommendations" to "service_role";

grant insert on table "public"."budget_recommendations" to "service_role";

grant references on table "public"."budget_recommendations" to "service_role";

grant select on table "public"."budget_recommendations" to "service_role";

grant trigger on table "public"."budget_recommendations" to "service_role";

grant truncate on table "public"."budget_recommendations" to "service_role";

grant update on table "public"."budget_recommendations" to "service_role";

grant delete on table "public"."budgets" to "anon";

grant insert on table "public"."budgets" to "anon";

grant references on table "public"."budgets" to "anon";

grant select on table "public"."budgets" to "anon";

grant trigger on table "public"."budgets" to "anon";

grant truncate on table "public"."budgets" to "anon";

grant update on table "public"."budgets" to "anon";

grant delete on table "public"."budgets" to "authenticated";

grant insert on table "public"."budgets" to "authenticated";

grant references on table "public"."budgets" to "authenticated";

grant select on table "public"."budgets" to "authenticated";

grant trigger on table "public"."budgets" to "authenticated";

grant truncate on table "public"."budgets" to "authenticated";

grant update on table "public"."budgets" to "authenticated";

grant delete on table "public"."budgets" to "service_role";

grant insert on table "public"."budgets" to "service_role";

grant references on table "public"."budgets" to "service_role";

grant select on table "public"."budgets" to "service_role";

grant trigger on table "public"."budgets" to "service_role";

grant truncate on table "public"."budgets" to "service_role";

grant update on table "public"."budgets" to "service_role";

grant delete on table "public"."expense_categories" to "anon";

grant insert on table "public"."expense_categories" to "anon";

grant references on table "public"."expense_categories" to "anon";

grant select on table "public"."expense_categories" to "anon";

grant trigger on table "public"."expense_categories" to "anon";

grant truncate on table "public"."expense_categories" to "anon";

grant update on table "public"."expense_categories" to "anon";

grant delete on table "public"."expense_categories" to "authenticated";

grant insert on table "public"."expense_categories" to "authenticated";

grant references on table "public"."expense_categories" to "authenticated";

grant select on table "public"."expense_categories" to "authenticated";

grant trigger on table "public"."expense_categories" to "authenticated";

grant truncate on table "public"."expense_categories" to "authenticated";

grant update on table "public"."expense_categories" to "authenticated";

grant delete on table "public"."expense_categories" to "service_role";

grant insert on table "public"."expense_categories" to "service_role";

grant references on table "public"."expense_categories" to "service_role";

grant select on table "public"."expense_categories" to "service_role";

grant trigger on table "public"."expense_categories" to "service_role";

grant truncate on table "public"."expense_categories" to "service_role";

grant update on table "public"."expense_categories" to "service_role";

grant delete on table "public"."expenses" to "anon";

grant insert on table "public"."expenses" to "anon";

grant references on table "public"."expenses" to "anon";

grant select on table "public"."expenses" to "anon";

grant trigger on table "public"."expenses" to "anon";

grant truncate on table "public"."expenses" to "anon";

grant update on table "public"."expenses" to "anon";

grant delete on table "public"."expenses" to "authenticated";

grant insert on table "public"."expenses" to "authenticated";

grant references on table "public"."expenses" to "authenticated";

grant select on table "public"."expenses" to "authenticated";

grant trigger on table "public"."expenses" to "authenticated";

grant truncate on table "public"."expenses" to "authenticated";

grant update on table "public"."expenses" to "authenticated";

grant delete on table "public"."expenses" to "service_role";

grant insert on table "public"."expenses" to "service_role";

grant references on table "public"."expenses" to "service_role";

grant select on table "public"."expenses" to "service_role";

grant trigger on table "public"."expenses" to "service_role";

grant truncate on table "public"."expenses" to "service_role";

grant update on table "public"."expenses" to "service_role";

grant delete on table "public"."goals" to "anon";

grant insert on table "public"."goals" to "anon";

grant references on table "public"."goals" to "anon";

grant select on table "public"."goals" to "anon";

grant trigger on table "public"."goals" to "anon";

grant truncate on table "public"."goals" to "anon";

grant update on table "public"."goals" to "anon";

grant delete on table "public"."goals" to "authenticated";

grant insert on table "public"."goals" to "authenticated";

grant references on table "public"."goals" to "authenticated";

grant select on table "public"."goals" to "authenticated";

grant trigger on table "public"."goals" to "authenticated";

grant truncate on table "public"."goals" to "authenticated";

grant update on table "public"."goals" to "authenticated";

grant delete on table "public"."goals" to "service_role";

grant insert on table "public"."goals" to "service_role";

grant references on table "public"."goals" to "service_role";

grant select on table "public"."goals" to "service_role";

grant trigger on table "public"."goals" to "service_role";

grant truncate on table "public"."goals" to "service_role";

grant update on table "public"."goals" to "service_role";

grant delete on table "public"."notifications" to "anon";

grant insert on table "public"."notifications" to "anon";

grant references on table "public"."notifications" to "anon";

grant select on table "public"."notifications" to "anon";

grant trigger on table "public"."notifications" to "anon";

grant truncate on table "public"."notifications" to "anon";

grant update on table "public"."notifications" to "anon";

grant delete on table "public"."notifications" to "authenticated";

grant insert on table "public"."notifications" to "authenticated";

grant references on table "public"."notifications" to "authenticated";

grant select on table "public"."notifications" to "authenticated";

grant trigger on table "public"."notifications" to "authenticated";

grant truncate on table "public"."notifications" to "authenticated";

grant update on table "public"."notifications" to "authenticated";

grant delete on table "public"."notifications" to "service_role";

grant insert on table "public"."notifications" to "service_role";

grant references on table "public"."notifications" to "service_role";

grant select on table "public"."notifications" to "service_role";

grant trigger on table "public"."notifications" to "service_role";

grant truncate on table "public"."notifications" to "service_role";

grant update on table "public"."notifications" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

create policy "Enable delete for users based on user_id"
on "public"."budget_allocations"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for authenticated users only"
on "public"."budget_allocations"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable update for users based on email"
on "public"."budget_allocations"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to view their own data only"
on "public"."budget_allocations"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Allow authenticated users to select their budget fixed expenses"
on "public"."budget_fixed_expenses"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Allow authenticated users to update their budget fixed expenses"
on "public"."budget_fixed_expenses"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable delete for users based on user_id"
on "public"."budget_fixed_expenses"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for authenticated users only"
on "public"."budget_fixed_expenses"
as permissive
for insert
to authenticated
with check (true);


create policy "Allow authenticated users to update their budget incomes"
on "public"."budget_incomes"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = budget_id))
with check ((( SELECT auth.uid() AS uid) = budget_id));


create policy "Enable delete for users based on user_id"
on "public"."budget_incomes"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for authenticated users only"
on "public"."budget_incomes"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable users to view their own data only"
on "public"."budget_incomes"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Allow authenticated users to delete their budget recommendation"
on "public"."budget_recommendations"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Allow authenticated users to insert budget recommendations"
on "public"."budget_recommendations"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Allow authenticated users to select their budget recommendation"
on "public"."budget_recommendations"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Allow authenticated users to update their budget recommendation"
on "public"."budget_recommendations"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Allow authenticated users to delete their budgets"
on "public"."budgets"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Allow authenticated users to insert budgets"
on "public"."budgets"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Allow authenticated users to select their budgets"
on "public"."budgets"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Allow authenticated users to update their budgets"
on "public"."budgets"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Allow authenticated users to delete their expense categories"
on "public"."expense_categories"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Allow authenticated users to insert expense categories"
on "public"."expense_categories"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Allow authenticated users to select their expense categories"
on "public"."expense_categories"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Allow authenticated users to update their expense categories"
on "public"."expense_categories"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Allow authenticated users to delete their expenses"
on "public"."expenses"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Allow authenticated users to insert expenses"
on "public"."expenses"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Allow authenticated users to select their expenses"
on "public"."expenses"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Allow authenticated users to update their expenses"
on "public"."expenses"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Allow authenticated users to delete their goals"
on "public"."goals"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Allow authenticated users to insert goals"
on "public"."goals"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Allow authenticated users to select their goals"
on "public"."goals"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Allow authenticated users to update their goals"
on "public"."goals"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Allow authenticated users to delete their own profile"
on "public"."profiles"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = id));


create policy "Allow authenticated users to insert their profile"
on "public"."profiles"
as permissive
for insert
to authenticated
with check (true);


create policy "Allow authenticated users to select their own profile"
on "public"."profiles"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = id));


create policy "Allow authenticated users to update their own profile"
on "public"."profiles"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = id))
with check ((( SELECT auth.uid() AS uid) = id));


CREATE TRIGGER budget_update_trigger AFTER UPDATE ON public.budgets FOR EACH ROW EXECUTE FUNCTION delete_budget_recommendations_and_allocations();

CREATE TRIGGER set_goal_status_on_insert BEFORE INSERT ON public.goals FOR EACH ROW EXECUTE FUNCTION update_goal_status();


