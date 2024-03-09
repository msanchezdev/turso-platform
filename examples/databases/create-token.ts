import inquirer from 'inquirer';
import { confirmExplicit, fmt, turso } from '../utils';
import chalk from 'chalk';
import type { DatabaseAuthorizationLevel } from '../../src/databases';

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
  `We will create a token for the database ${fmt.primary(
    databaseName,
  )} in the organization ${fmt.primary(organization)}`,
);
const { expiration } = await inquirer.prompt<{ expiration: string }>({
  type: 'input',
  message:
    'Token expiration (e.g. never, 1h, 1d, 1w, 1m, 1y, 1h30m, 1d12h, 1w3d, 1m2w, 1y6m3w2d12h30m)',
  default: '5m',
  name: 'expiration',
});

const { authorization } = await inquirer.prompt<{
  authorization: DatabaseAuthorizationLevel;
}>({
  type: 'list',
  message: 'Authorization level (e.g. full-access, read-only)',
  name: 'authorization',
  loop: false,
  choices: ['full-access', 'read-only'],
});

const { jwt } = await turso.databases.createToken(organization, databaseName, {
  expiration,
  authorization,
});

console.log(
  `Token created for database ${fmt.primary(
    databaseName,
  )} in organization ${fmt.primary(organization)}`,
);
console.log(fmt.string(`  ${jwt}`));
