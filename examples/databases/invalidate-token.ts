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
  )} This operation is irreversible. All tokens for this database will be deleted.
`),
);

const confirmed = await confirmExplicit();

if (!confirmed) {
  process.exit(0);
}

await turso.databases.invalidateTokens(organization, databaseName);
console.log(fmt.success('Tokens invalidated'));
