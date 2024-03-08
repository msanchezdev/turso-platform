import { fmt, turso } from '../utils';

const organizations = await turso.organizations.list();

for (const organization of organizations) {
  const { databases } = await turso.databases.list(organization.slug);

  for (const database of databases) {
    console.log(
      `Database: ${fmt.primary(database.Name)} (${fmt.secondary(
        database.DbId,
      )})`,
    );
    console.log(`  Hostname: ${fmt.string(database.Hostname)}`);
    console.log(`  Group: ${fmt.string(database.group)}`);
    console.log(`  Primary group: ${fmt.string(database.primaryGroup)}`);
    console.log(`  Regions: ${fmt.string(database.regions.join(', '))}`);
    console.log(`  Type: ${fmt.string(database.type)}`);
    console.log(`  Version: ${fmt.secondary(database.version)}`);
  }
}
