import { fmt, turso } from '../utils';

const organizations = await turso.organizations.list();

for (const organization of organizations) {
  console.log(`
- Organization: ${fmt.string(organization.name)}
    Type: ${fmt.string(organization.type)}
    Slug: ${fmt.string(organization.slug)}
    Overages: ${fmt.boolean(organization.overages)}
    Blocked Reads: ${fmt.boolean(organization.blocked_reads)}
    Blocked Writes: ${fmt.boolean(organization.blocked_writes)}
    Plan: ${fmt.string(organization.plan_id)}
    Plan Timeline: ${fmt.string(organization.plan_timeline)}
    Memory: ${fmt.number(organization.memory)}
`);
}
