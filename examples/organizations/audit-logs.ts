import { fmt, turso } from '../utils';

const organizations = await turso.organizations.list();

for (const organization of organizations) {
  console.log(
    `Organization: ${fmt.string(organization.name)} (${fmt.secondary(
      organization.slug,
    )})`,
  );

  const { audit_logs } = await turso.organizations.auditLogs(organization.slug);

  for (const log of audit_logs) {
    console.log(
      `  ${fmt.primary(log.created_at + ' |')} ${log.author} ${fmt.secondary(
        log.code,
      )} ${fmt.muted(log.message)}`,
    );
    console.log(
      `      ${fmt.muted(
        JSON.stringify(log.data, null, 2).replaceAll('\n', '\n    '),
      )}`,
    );
  }
}
