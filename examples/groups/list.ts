import { turso, fmt } from '../utils';

const organizations = await turso.organizations.list();
for (const organization of organizations) {
  const { groups } = await turso.groups.list(organization.slug);

  console.log(
    `Organization: ${fmt.string(organization.name)} (${fmt.secondary(
      organization.slug,
    )})`,
  );
  for (const group of groups) {
    console.log(`  - ${fmt.primary(group.name)}`);
    console.log(`      Archived: ${fmt.boolean(group.archived)}`);
    console.log(`      Locations: ${fmt.string(group.locations.join(', '))}`);
    console.log(`      Primary Location: ${fmt.string(group.primary)}`);
  }
}
