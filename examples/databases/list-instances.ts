import inquirer from 'inquirer';
import { fmt, turso } from '../utils';
import chalk from 'chalk';

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

const { locations } = await turso.locations.list();

const { instances } = await turso.databases.listInstances(
  organization,
  databaseName,
);
for (const instance of instances) {
  console.log(`Instance: ${fmt.string(instance.uuid)}`);
  console.log(`  - Hostname: ${fmt.string(instance.hostname)}`);
  console.log(`  - Name: ${fmt.string(instance.region)}`);
  console.log(
    `  - Region: ${fmt.string(locations[instance.region] ?? instance.region)}`,
  );
  console.log(`  - Type: ${fmt.secondary(instance.type)}`);
}
