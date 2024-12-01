create extension if not exists "pg_net" with schema "public" version '0.13.0';

create policy "Enable all access for service role"
on "public"."accounts"
as permissive
for all
to public
using ((auth.role() = 'service_role'::text));


create policy "Enable all access for service role"
on "public"."beneficial_owners"
as permissive
for all
to public
using ((auth.role() = 'service_role'::text));


create policy "Enable all access for service role"
on "public"."companies"
as permissive
for all
to public
using ((auth.role() = 'service_role'::text));


create policy "Enable all access for service role"
on "public"."gp_roles"
as permissive
for all
to public
using ((auth.role() = 'service_role'::text));


create policy "Enable all access for service role"
on "public"."investments"
as permissive
for all
to public
using ((auth.role() = 'service_role'::text));


create policy "Enable all access for service role"
on "public"."user_profiles"
as permissive
for all
to public
using ((auth.role() = 'service_role'::text));



