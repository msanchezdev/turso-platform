import inquirer from 'inquirer';
import { confirmExplicit, fmt, turso } from '../utils';
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

console.log(
  fmt.danger(`
  ${chalk.bold(
    `PROCEED WITH CAUTION:`,
  )} This operation is irreversible. All data in the database ${databaseName} in the organization ${organization} will be deleted.
`),
);

const confirmed = await confirmExplicit(
  `Are you sure you want to delete the database: ${fmt.string(databaseName)}? `,
);

if (!confirmed) {
  console.log('Operation cancelled');
  process.exit(0);
}

const { database } = await turso.databases.delete(organization, databaseName);
console.log(`Deleted database: ${fmt.string(databaseName)}`);
