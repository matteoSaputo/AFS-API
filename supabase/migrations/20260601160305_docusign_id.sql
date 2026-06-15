begin;

alter table packages
add column if not exists docusign_envelope_id text unique;

commit;