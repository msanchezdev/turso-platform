import inquirer from 'inquirer';
import { fmt, turso } from '../utils';

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

const selectedDatabase = databases.find((d) => d.Name === databaseName);
if (!selectedDatabase) {
  throw new Error(`Database not found: ${databaseName}`);
}

const { locations } = await turso.locations.list();

const { instance: instanceName } = await inquirer.prompt<{ instance: string }>({
  type: 'list',
  message: 'Select an instance',
  name: 'instance',
  loop: false,
  choices: selectedDatabase.regions.map((region) => ({
    name: locations[region] ?? region,
    value: region,
  })),
});

const { instance } = await turso.databases.retrieveInstance(
  organization,
  databaseName,
  instanceName,
);
console.log(`Instance: ${fmt.string(instance.uuid)}`);
console.log(`  - Hostname: ${fmt.string(instance.hostname)}`);
console.log(`  - Name: ${fmt.string(instance.region)}`);
console.log(
  `  - Region: ${fmt.string(locations[instance.region] ?? instance.region)}`,
);
console.log(`  - Type: ${fmt.secondary(instance.type)}`);
