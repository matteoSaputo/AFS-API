begin;

-- Dedicated API user role
do $$
begin
    if not exists (
        select 1 from pg_roles where rolname = 'api_user'
    ) then
        create role api_user
    end if;
end
$$;

--Allow the following:
--  -connect to db
--  -access public schema
--  -allow CRUD
--  -usage of all sequences in public
--  -ensure same persmisisons on all future tables

grant connect on database postgres to api_user;
grant usage on schema public to api_user;
grant select, insert, update, delete on all tables in schema public to api_user;
grant usage, select on all sequences in schema public to api_user;

alter default privileges in schema public
grant select, insert, update, delete on tables to api_user;

alter default privileges in schema public
grant usage, select on sequences to api_user;

commit;