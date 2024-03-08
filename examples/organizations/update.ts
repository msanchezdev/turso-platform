import { fmt, isProd, turso } from '../utils';

const org = isProd ? 'yourorg' : 'turso-local';

const result = await turso.organizations.update(org, {
  overages: false,
});

const { organization } = result;
console.log(`
Organization: ${fmt.string(organization.name)}
  Type: ${fmt.string(organization.type)}
  Slug: ${fmt.string(organization.slug)}
  Overages: ${fmt.boolean(organization.overages)}
  Blocked Reads: ${fmt.boolean(organization.blocked_reads)}
  Blocked Writes: ${fmt.boolean(organization.blocked_writes)}
  Plan: ${fmt.string(organization.plan_id)}
  Plan Timeline: ${fmt.string(organization.plan_timeline)}
  Memory: ${fmt.number(organization.memory)}
`);
