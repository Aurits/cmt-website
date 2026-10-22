-- Who appears on the public site, and who signs reports.
--
-- Added when CMT sent its staff list (October 2026). Two people from the earlier directory are
-- not on it: they stay in the table, because listings still reference them, but the public site
-- must not show them (`listed`). Six people are registered valuers who sign every report
-- (`signs_reports`): that drives the signatory roll on /valuations and the "registered valuers"
-- figure, so it is stored rather than inferred from rank.
--
-- Both default to the safe reading for an existing row: shown, not a signatory. A person only
-- becomes a signatory when someone says so.

alter table agents add column if not exists listed        boolean not null default true;
alter table agents add column if not exists signs_reports boolean not null default false;
