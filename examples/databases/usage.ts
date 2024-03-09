import inquirer from 'inquirer';
import { bytesToSize, fmt, turso } from '../utils';

const organizations = await turso.organizations.list();
const { organization } = await inquirer.prompt<{ organization: string }>({
  type: 'list',
  message: 'Select an organization',
  name: 'organization',
  loop: false,
  choices: organizations.map((o) => ({
    name: o.name,
    value: o.slug,
  })),
});

console.log(fmt.muted(`Selected organization: ${organization}`));

const { databases } = await turso.databases.list(organization);
const { databaseName } = await inquirer.prompt<{ databaseName: string }>({
  type: 'list',
  message: 'Select a database',
  name: 'databaseName',
  loop: false,
  choices: databases.map((d) => d.Name),
});

const { database } = await turso.databases.getUsage(organization, databaseName);

console.log(`Database: ${fmt.string(databaseName)}`);
console.log(`Rows Read: ${fmt.number(database.usage.rows_read)}`);
console.log(`Rows Written: ${fmt.number(database.usage.rows_written)}`);
console.log(
  `Storage: ${fmt.secondary(bytesToSize(database.usage.storage_bytes))}`,
);
console.log(`Instances:`);

for (const instance of database.instances) {
  console.log(`  - ${fmt.string(instance.uuid)}`);
  console.log(`    Rows Read: ${fmt.number(instance.usage.rows_read)}`);
  console.log(`    Rows Written: ${fmt.number(instance.usage.rows_written)}`);
  console.log(
    `    Storage: ${fmt.secondary(bytesToSize(instance.usage.storage_bytes))}`,
  );
}
